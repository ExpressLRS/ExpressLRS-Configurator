/* eslint-disable no-bitwise */
import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import cloneDeep from 'lodash/cloneDeep';
import Crypto from 'crypto';
import semver from 'semver';
import UserDefine from '../../models/UserDefine';
import FirmwareSource from '../../models/enum/FirmwareSource';
import BuildFlashFirmwareResult from '../../models/BuildFlashFirmwareResult';
import Mutex from '../../library/Mutex';
import BuildFirmwareErrorType from '../../models/enum/BuildFirmwareErrorType';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import { LoggerService } from '../../logger';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import { BuildFlashFirmwareParams } from '../FlashingStrategyLocator/BuildFlashFirmwareParams';
import {
  FlashingStrategy,
  IsCompatibleArgs,
} from '../FlashingStrategyLocator/FlashingStrategy';
import ConfigureFirmware from '../../library/ConfigureFirmware';
import { Options } from '../../library/ConfigureFirmware/Options';
import { Config } from '../../library/ConfigureFirmware/Config';
import Domain from '../../library/ConfigureFirmware/Domain';
import Target from '../../models/Target';
import { Targets } from '../../library/ConfigureFirmware/Targets';
import TargetArgs from '../../graphql/args/Target';
import GitRepository from '../../graphql/inputs/GitRepositoryInput';
import Device from '../../models/Device';
import { UserDefineFilters } from '../UserDefinesLoader';
import FlashingMethod from '../../models/enum/FlashingMethod';
import DeviceType from '../../models/enum/DeviceType';
import TargetUserDefinesFactory from '../../factories/TargetUserDefinesFactory';

const maskSensitiveData = (haystack: string): string => {
  const needles = [
    'HOME_WIFI_SSID',
    'HOME_WIFI_PASSWORD',
    'MY_BINDING_PHRASE',
    'MY_UID',
  ];
  for (let i = 0; i < needles.length; i++) {
    if (haystack.includes(needles[i])) {
      return '***';
    }
  }
  return haystack;
};

const maskBuildFlashFirmwareParams = (
  params: BuildFlashFirmwareParams
): BuildFlashFirmwareParams => {
  const result = cloneDeep(params);
  if (result.userDefinesTxt?.length > 0) {
    result.userDefinesTxt = '******';
  }
  result.userDefines = result.userDefines.map((userDefine) => {
    const sensitiveDataKeys = [
      UserDefineKey.BINDING_PHRASE,
      UserDefineKey.HOME_WIFI_SSID,
      UserDefineKey.HOME_WIFI_PASSWORD,
    ];
    if (sensitiveDataKeys.includes(userDefine.key)) {
      return {
        ...userDefine,
        value: '***',
      };
    }
    return userDefine;
  });
  return result;
};

@Service()
export default class BinaryFlashingStrategyService implements FlashingStrategy {
  mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private pubSub: PubSubEngine,
    private logger: LoggerService
  ) {
    this.mutex = new Mutex();
  }

  private async updateProgress(
    type: BuildProgressNotificationType,
    step: BuildFirmwareStep
  ): Promise<void> {
    this.logger?.log('build progress notification', {
      type,
      step,
    });
    return this.pubSub!.publish(PubSubTopic.BuildProgressNotification, {
      type,
      step,
    });
  }

  private async updateLogs(data: string): Promise<void> {
    const maskedData = maskSensitiveData(data);
    this.logger?.log('logs stream output', {
      data: maskedData,
    });
    return this.pubSub!.publish(PubSubTopic.BuildLogsUpdate, {
      data: maskedData,
    });
  }

  async getTargets(workingDirectory: string) {
    const targetsFile = path.join(workingDirectory, 'hardware', 'targets.json');
    this.logger.log(`Loading targets from ${targetsFile}`);
    const targets = JSON.parse(
      await fs.promises.readFile(targetsFile, 'utf-8')
    ) as Targets;
    return targets;
  }

  async getConfig(workingDirectory: string, devicePath: string) {
    const [manufacturer, type, product] = devicePath.split('.');
    const targets = await this.getTargets(workingDirectory);
    let config: Config;
    if (type === 'rx_2400') {
      config = targets[manufacturer].rx_2400[product];
    } else if (type === 'rx_900') {
      config = targets[manufacturer].rx_900[product];
    } else if (type === 'tx_2400') {
      config = targets[manufacturer].tx_2400[product];
    } else if (type === 'tx_900') {
      config = targets[manufacturer].tx_900[product];
    } else {
      throw new Error(`Unknown type ${type} encountered`);
    }
    return config;
  }

  uploadMethodToFlashingMethod(uploadMethod: string): FlashingMethod {
    switch (uploadMethod.toLowerCase()) {
      case 'betaflight':
        return FlashingMethod.BetaflightPassthrough;
        break;
      case 'dfu':
        return FlashingMethod.DFU;
        break;
      case 'etx':
        return FlashingMethod.EdgeTxPassthrough;
        break;
      case 'stlink':
        return FlashingMethod.STLink;
        break;
      case 'uart':
        return FlashingMethod.UART;
        break;
      case 'wifi':
        return FlashingMethod.WIFI;
        break;

      default:
        throw new Error(`Upload Method ${uploadMethod} Not Recognized!`);
        break;
    }
  }

  configToDevice(id: string, category: string, config: Config): Device {
    return new Device(
      id,
      config.product_name,
      category,
      config.upload_methods.map((uploadMethod) => {
        const targetName = `${id}.${uploadMethod}`;
        return new Target(
          targetName,
          targetName,
          this.uploadMethodToFlashingMethod(uploadMethod)
        );
      }),
      [],
      DeviceType.ExpressLRS,
      true
    );
  }

  verifyConfig(id: string, config: Config) {
    let missingFields = '';
    const logMissingField = (field: string) => {
      if (missingFields.length > 0) {
        missingFields += ', ';
      }
      missingFields += field;
    };
    let valid = true;
    if (!config.firmware) {
      logMissingField('firmware');
      valid = false;
    }
    if (!config.platform) {
      logMissingField('platform');
      valid = false;
    }
    if (!config.product_name) {
      logMissingField('product_name');
      valid = false;
    }
    if (!config.upload_methods) {
      logMissingField('upload_methods');
      valid = false;
    }

    if (!valid) {
      this.logger.error(
        `${id} in targets file is not a valid Config, missing fields ${missingFields}`
      );
    }
    return valid;
  }

  async availableFirmwareTargets(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]> {
    const targets = await this.getTargets(this.firmwaresPath);
    const devices: Device[] = [];
    Object.keys(targets).forEach((manufacturerKey) => {
      const manufacturerConfig = targets[manufacturerKey];
      if (manufacturerConfig.rx_2400) {
        Object.keys(manufacturerConfig.rx_2400).forEach((deviceKey) => {
          const deviceConfig = manufacturerConfig.rx_2400[deviceKey];
          const id = `${manufacturerKey}.rx_2400.${deviceKey}`;

          if (this.verifyConfig(id, deviceConfig)) {
            const device = this.configToDevice(
              id,
              manufacturerConfig.name,
              deviceConfig
            );
            devices.push(device);
          }
        });
      }
      if (manufacturerConfig.rx_900) {
        Object.keys(manufacturerConfig.rx_900).forEach((deviceKey) => {
          const deviceConfig = manufacturerConfig.rx_900[deviceKey];
          const id = `${manufacturerKey}.rx_900.${deviceKey}`;

          if (this.verifyConfig(id, deviceConfig)) {
            const device = this.configToDevice(
              id,
              manufacturerConfig.name,
              deviceConfig
            );
            devices.push(device);
          }
        });
      }
      if (manufacturerConfig.tx_2400) {
        Object.keys(manufacturerConfig.tx_2400).forEach((deviceKey) => {
          const deviceConfig = manufacturerConfig.tx_2400[deviceKey];
          const id = `${manufacturerKey}.tx_2400.${deviceKey}`;

          if (this.verifyConfig(id, deviceConfig)) {
            const device = this.configToDevice(
              id,
              manufacturerConfig.name,
              deviceConfig
            );
            devices.push(device);
          }
        });
      }
      if (manufacturerConfig.tx_900) {
        Object.keys(manufacturerConfig.tx_900).forEach((deviceKey) => {
          const deviceConfig = manufacturerConfig.tx_900[deviceKey];
          const id = `${manufacturerKey}.tx_900.${deviceKey}`;

          if (this.verifyConfig(id, deviceConfig)) {
            const device = this.configToDevice(
              id,
              manufacturerConfig.name,
              deviceConfig
            );
            devices.push(device);
          }
        });
      }
    });
    return devices;
  }

  async targetDeviceOptions(
    args: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    const config = await this.getConfig(this.firmwaresPath, args.target);
    const userDefines: UserDefine[] = [];
    const targetUserDefinesFactory = new TargetUserDefinesFactory();
    userDefines.push(
      targetUserDefinesFactory.build(UserDefineKey.BINDING_PHRASE)
    );
    if (args.target.includes('_2400.')) {
      userDefines.push(
        targetUserDefinesFactory.build(
          UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400
        )
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_ISM_2400)
      );
    }
    if (args.target.includes('_900.')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_AU_915)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_EU_868)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_FCC_915)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_IN_866)
      );
    }
    if (['esp32', 'esp8285'].includes(config.platform)) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.HOME_WIFI_SSID)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.HOME_WIFI_SSID)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.AUTO_WIFI_ON_INTERVAL)
      );
    }
    if (config.features && config.features.includes('buzzer')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.DISABLE_ALL_BEEPS)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.JUST_BEEP_ONCE)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.MY_STARTUP_MELODY)
      );
    }
    if (config.features && config.features.includes('unlock-higher-power')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.UNLOCK_HIGHER_POWER)
      );
    }
    if (config.features && config.features.includes('sbus-uart')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.USE_R9MM_R9MINI_SBUS)
      );
    }
    if (args.target.includes('.tx_')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.TLM_REPORT_INTERVAL_MS)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.UART_INVERTED)
      );
    }
    if (args.target.includes('.rx_')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.RCVR_UART_BAUD)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.RCVR_INVERT_TX)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.LOCK_ON_FIRST_CONNECTION)
      );
    }
    return userDefines;
  }

  private osUsernameContainsAmpersand(): boolean {
    if (
      os.platform() === 'win32' &&
      os.userInfo({ encoding: 'utf8' }).username.indexOf('&') > -1
    ) {
      return true;
    }
    return false;
  }

  async isCompatible(
    params: IsCompatibleArgs,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ) {
    if (
      gitRepositoryUrl.toLowerCase() ===
        'https://github.com/ExpressLRS/ExpressLRS'.toLowerCase() &&
      params.source === FirmwareSource.GitTag &&
      semver.compare(params.gitTag, '3.0.0') >= 0
    ) {
      return true;
    }

    return false;
  }

  async buildFlashFirmware(
    params: BuildFlashFirmwareParams,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ): Promise<BuildFlashFirmwareResult> {
    this.logger?.log('received build firmware request', {
      params: maskBuildFlashFirmwareParams(params),
      gitRepositoryUrl,
    });

    if (this.mutex.isLocked()) {
      this.logger?.error('there is another build/flash request in progress...');
      return new BuildFlashFirmwareResult(
        false,
        'there is another build/flash request in progress...',
        BuildFirmwareErrorType.GenericError
      );
    }
    this.mutex.tryLock();

    try {
      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.VERIFYING_BUILD_SYSTEM
      );

      const badUsername = this.osUsernameContainsAmpersand();
      if (badUsername) {
        return new BuildFlashFirmwareResult(
          false,
          'Windows username contains & ampersand character. At this time it is not supported and build process will fail. Please change the Windows username.',
          BuildFirmwareErrorType.GenericError
        );
      }

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.DOWNLOADING_FIRMWARE
      );

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.FLASHING_FIRMWARE
      );

      const config = await this.getConfig(this.firmwaresPath, params.target);
      // need a better way to do this, it should really be included in the config
      const deviceType = params.target.includes('.tx_') ? 'TX' : 'RX';
      const radioType = params.target.includes('_900.') ? 'sx127x' : 'sx128x';

      // assign some default values
      const options: Options = {
        'wifi-on-interval': 60,
      };

      if (deviceType === 'RX') {
        options['rcvr-uart-baud'] = 420000;
        options['rcvr-invert-tx'] = false;
        options['lock-on-first-connection'] = false;
      } else {
        options['tlm-interval'] = 240;
      }

      let fcclbt = 'FCC';
      params.userDefines.forEach((userDefine) => {
        if (
          userDefine.key === UserDefineKey.AUTO_WIFI_ON_INTERVAL &&
          userDefine.value &&
          userDefine.enabled
        ) {
          const wifiOnInterval = Number.parseInt(userDefine.value, 10);
          if (!Number.isNaN(wifiOnInterval)) {
            options['wifi-on-interval'] = wifiOnInterval;
          }
        } else if (
          userDefine.key === UserDefineKey.BINDING_PHRASE &&
          userDefine.value &&
          userDefine.enabled
        ) {
          const bindingPhraseFull = `-DMY_BINDING_PHRASE="${userDefine.value}"`;
          const bindingPhraseHashed = new Uint8Array(
            Crypto.createHash('md5').update(bindingPhraseFull).digest()
          );
          options.uid = Array.from(bindingPhraseHashed.subarray(0, 6));
        } else if (
          userDefine.key === UserDefineKey.DISABLE_ALL_BEEPS &&
          userDefine.enabled
        ) {
          options.beeptype = 0;
        } else if (
          userDefine.key === UserDefineKey.JUST_BEEP_ONCE &&
          userDefine.enabled
        ) {
          options.beeptype = 1;
        } else if (
          userDefine.key === UserDefineKey.MY_STARTUP_MELODY &&
          userDefine.enabled &&
          userDefine.value
        ) {
          options.beeptype = 4;
          // TODO: Fix melody parsing, importing module bluejay-rtttl-parse gives the error Unexpected token 'export'
          // options.melody = MelodyParser.parseToArray(userDefine.value);
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_AU_433 &&
          userDefine.enabled
        ) {
          options.domain = Domain.AU433;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_AU_915 &&
          userDefine.enabled
        ) {
          options.domain = Domain.AU915;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_EU_433 &&
          userDefine.enabled
        ) {
          options.domain = Domain.EU433;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_EU_868 &&
          userDefine.enabled
        ) {
          options.domain = Domain.EU868;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_FCC_915 &&
          userDefine.enabled
        ) {
          options.domain = Domain.FCC915;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_IN_866 &&
          userDefine.enabled
        ) {
          options.domain = Domain.IN866;
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400 &&
          userDefine.enabled
        ) {
          fcclbt = 'LBT';
        } else if (
          userDefine.key === UserDefineKey.REGULATORY_DOMAIN_ISM_2400 &&
          userDefine.enabled
        ) {
          fcclbt = 'FCC';
        } else if (userDefine.key === UserDefineKey.LOCK_ON_FIRST_CONNECTION) {
          options['lock-on-first-connection'] = userDefine.enabled;
        } else if (
          userDefine.key === UserDefineKey.RCVR_UART_BAUD &&
          userDefine.enabled &&
          userDefine.value
        ) {
          const RCVR_UART_BAUD = Number.parseInt(userDefine.value, 10);
          options['rcvr-uart-baud'] = RCVR_UART_BAUD;
        } else if (userDefine.key === UserDefineKey.RCVR_INVERT_TX) {
          options['rcvr-invert-tx'] = userDefine.enabled;
        } else if (
          userDefine.key === UserDefineKey.TLM_REPORT_INTERVAL_MS &&
          userDefine.enabled &&
          userDefine.value
        ) {
          const TLM_REPORT_INTERVAL_MS = Number.parseInt(userDefine.value, 10);
          options['tlm-interval'] = TLM_REPORT_INTERVAL_MS;
        } else if (userDefine.key === UserDefineKey.UART_INVERTED) {
          options['uart-inverted'] = userDefine.enabled;
        } else if (userDefine.key === UserDefineKey.UNLOCK_HIGHER_POWER) {
          options['unlock-higher-power'] = userDefine.enabled;
        } else if (
          userDefine.key === UserDefineKey.HOME_WIFI_PASSWORD &&
          userDefine.enabled
        ) {
          options['wifi-password'] = userDefine.value;
        } else if (
          userDefine.key === UserDefineKey.HOME_WIFI_SSID &&
          userDefine.enabled
        ) {
          options['wifi-ssid'] = userDefine.value;
        } else if (userDefine.key === UserDefineKey.USE_R9MM_R9MINI_SBUS) {
          options['r9mm-mini-sbus'] = userDefine.enabled;
        }
      });
      const folder = this.firmwaresPath;
      const firmware = await ConfigureFirmware.getFirmware(
        deviceType,
        radioType,
        config,
        options,
        folder,
        fcclbt
      );
      if (firmware.firmware) {
        const firmwareBinPath = path.join(
          this.firmwaresPath,
          `${this.generateFirmwareName(config.product_name, params)}.bin`
        );
        fs.promises.writeFile(
          firmwareBinPath,
          Buffer.from(firmware.firmware.data.buffer)
        );
        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          firmwareBinPath
        );
      }

      return new BuildFlashFirmwareResult(true);
    } catch (e) {
      this.logger?.error('generic error', undefined, {
        err: e,
      });
      return new BuildFlashFirmwareResult(
        false,
        `Error: ${e}`,
        BuildFirmwareErrorType.GenericError
      );
    } finally {
      this.mutex.unlock();
    }
  }

  generateFirmwareName(
    deviceName: string,
    params: BuildFlashFirmwareParams
  ): string {
    const { source, gitBranch, gitCommit, gitTag, gitPullRequest } =
      params.firmware;

    const firmwareName = deviceName?.replaceAll(' ', '_');

    switch (source) {
      case FirmwareSource.GitTag:
        return `${firmwareName}-${gitTag}`;
      case FirmwareSource.GitBranch:
        return `${firmwareName}-${gitBranch}`;
      case FirmwareSource.GitCommit:
        return `${firmwareName}-${gitCommit}`;
      case FirmwareSource.GitPullRequest:
        return `${firmwareName}-PR_${gitPullRequest?.number}`;
      default:
        return `${firmwareName}`;
    }
  }

  async clearFirmwareFiles(): Promise<void> {
    const rmrf = async (file: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        rimraf(file, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      });
    };
    const listFiles = async (directory: string): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files.map((file) => path.join(directory, file)));
          }
        });
      });
    };
    const files = await listFiles(this.firmwaresPath);
    this.logger?.log('removing firmware files', {
      firmwaresPath: this.firmwaresPath,
      files,
    });
    if (files.length > 4) {
      throw new Error(`unexpected number of files to remove: ${files}`);
    }
    await Promise.all(files.map((item) => rmrf(item)));
  }
}
