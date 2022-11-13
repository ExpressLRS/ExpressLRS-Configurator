/* eslint-disable no-bitwise */
import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import cloneDeep from 'lodash/cloneDeep';
import semver from 'semver';
import UserDefine from '../../models/UserDefine';
import FirmwareSource from '../../models/enum/FirmwareSource';
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
import TargetArgs from '../../graphql/args/Target';
import GitRepository from '../../graphql/inputs/GitRepositoryInput';
import Device from '../../models/Device';
import { UserDefineFilters } from '../UserDefinesLoader';
import BuildJobType from '../../models/enum/BuildJobType';
import BuildFlashFirmwareResult from '../../graphql/objects/BuildFlashFirmwareResult';
import Python from '../../library/Python';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import DeviceDescriptionsLoader from './DeviceDescriptionsLoader';
import FlashingMethod from '../../models/enum/FlashingMethod';

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
  readonly name: string = 'BinaryFlashingStrategy';

  private mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private pubSub: PubSubEngine,
    private python: Python,
    private deviceDescriptionsLoader: DeviceDescriptionsLoader,
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

  private async updateLogs(data: string, newline = true): Promise<void> {
    const maskedData = maskSensitiveData(data);
    this.logger?.log('logs stream output', {
      data: maskedData,
    });
    return this.pubSub!.publish(PubSubTopic.BuildLogsUpdate, {
      data: maskedData + (newline ? '\n' : ''),
    });
  }

  async availableFirmwareTargets(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]> {
    return this.deviceDescriptionsLoader.loadTargetsList(args, gitRepository);
  }

  async targetDeviceOptions(
    args: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    return this.deviceDescriptionsLoader.targetDeviceOptions(
      args,
      gitRepository
    );
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

  // @TODO: check remote build cache
  // @TODO: checkout git repository for a full check
  async isCompatible(
    params: IsCompatibleArgs,
    gitRepositoryUrl: string,
    _gitRepositorySrcFolder: string
  ) {
    if (
      gitRepositoryUrl.toLowerCase() ===
        'https://github.com/expresslrs/expresslrs'.toLowerCase() &&
      params.source === FirmwareSource.GitTag &&
      semver.compare(params.gitTag, '3.0.0') >= 0
    ) {
      return true;
    }

    return false;
  }

  userDefinesToFlags(userDefines: UserDefine[]): string[][] {
    const flags: string[][] = [];
    userDefines
      .filter(({ enabled }) => enabled)
      .forEach((userDefine) => {
        switch (userDefine.key) {
          case UserDefineKey.BINDING_PHRASE:
            flags.push(['--phrase', userDefine.value!]);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_AU_433:
            flags.push(['--domain', 'au_433']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_EU_433:
            flags.push(['--domain', 'eu_433']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_AU_915:
            flags.push(['--domain', 'au_915']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
            flags.push(['--domain', 'fcc_915']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_EU_868:
            flags.push(['--domain', 'eu_868']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_IN_866:
            flags.push(['--domain', 'in_866']);
            break;
          case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
            break;
          case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
            flags.push(['--lbt']);
            break;
          case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
            flags.push(['--auto-wifi', userDefine.value!]);
            break;
          case UserDefineKey.HOME_WIFI_SSID:
            flags.push(['--ssid', userDefine.value!]);
            break;
          case UserDefineKey.HOME_WIFI_PASSWORD:
            flags.push(['--password', userDefine.value!]);
            break;
          case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
            break;
          case UserDefineKey.JUST_BEEP_ONCE:
            flags.push(['--buzzer-mode', 'one-beep']);
            break;
          case UserDefineKey.DISABLE_ALL_BEEPS:
            flags.push(['--buzzer-mode', 'quiet']);
            break;
          case UserDefineKey.DISABLE_STARTUP_BEEP:
            flags.push(['--buzzer-mode', 'quiet']);
            break;
          case UserDefineKey.MY_STARTUP_MELODY:
            flags.push(['--buzzer-mode', 'custom']);
            flags.push(['--buzzer-melody', userDefine.key]);
            break;
          case UserDefineKey.RCVR_INVERT_TX:
            flags.push(['--invert-tx']);
            break;
          case UserDefineKey.RCVR_UART_BAUD:
            flags.push(['--rx-baud', userDefine.value!]);
            break;
          case UserDefineKey.TLM_REPORT_INTERVAL_MS:
            flags.push(['--tlm-report', userDefine.value!]);
            break;
          case UserDefineKey.UART_INVERTED:
            flags.push(['--uart-inverted']);
            break;
          case UserDefineKey.UNLOCK_HIGHER_POWER:
            flags.push(['--unlock-higher-power']);
            break;
          case UserDefineKey.USE_R9MM_R9MINI_SBUS:
            flags.push(['--r9mm-mini-sbus']);
            break;
          // not supported
          case UserDefineKey.USE_TX_BACKPACK:
          case UserDefineKey.WS2812_IS_GRB:
          case UserDefineKey.DEVICE_NAME:
            break;
          default:
            const exhaustiveCheck: never = userDefine.key;
            throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
        }
      });
    return flags;
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

      let gitPath = '';
      try {
        gitPath = await findGitExecutable(this.PATH);
      } catch (e) {
        this.logger?.error('failed to find git', undefined, {
          PATH: this.PATH,
          err: e,
        });
        return new BuildFlashFirmwareResult(
          false,
          `${e}`,
          BuildFirmwareErrorType.GitDependencyError
        );
      }
      this.logger?.log('git path', {
        gitPath,
      });

      const firmwareDownload = new GitFirmwareDownloader(
        {
          baseDirectory: this.firmwaresPath,
          gitBinaryLocation: gitPath,
        },
        this.logger
      );

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.DOWNLOADING_FIRMWARE
      );
      let firmwarePath = '';
      switch (params.firmware.source) {
        case FirmwareSource.GitTag:
          const tagResult = await firmwareDownload.checkoutTag(
            gitRepositoryUrl,
            gitRepositorySrcFolder,
            params.firmware.gitTag
          );
          firmwarePath = tagResult.path;
          break;
        case FirmwareSource.GitBranch:
          const branchResult = await firmwareDownload.checkoutBranch(
            gitRepositoryUrl,
            gitRepositorySrcFolder,
            params.firmware.gitBranch
          );
          firmwarePath = branchResult.path;
          break;
        case FirmwareSource.GitCommit:
          const commitResult = await firmwareDownload.checkoutCommit(
            gitRepositoryUrl,
            gitRepositorySrcFolder,
            params.firmware.gitCommit
          );
          firmwarePath = commitResult.path;
          break;
        case FirmwareSource.Local:
          firmwarePath = params.firmware.localPath;
          break;
        case FirmwareSource.GitPullRequest:
          if (params.firmware.gitPullRequest) {
            const pullRequestResult = await firmwareDownload.checkoutCommit(
              gitRepositoryUrl,
              gitRepositorySrcFolder,
              params.firmware.gitPullRequest.headCommitHash
            );
            firmwarePath = pullRequestResult.path;
          }
          break;
        default:
          throw new Error(
            `unsupported firmware source: ${params.firmware.source}`
          );
      }
      this.logger?.log('firmware path', {
        firmwarePath,
        gitRepositoryUrl,
      });

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.FLASHING_FIRMWARE
      );

      const config = await this.deviceDescriptionsLoader.getDeviceConfig(
        {
          ...params.firmware,
          target: params.target,
        },
        {
          url: gitRepositoryUrl,
          srcFolder: gitRepositorySrcFolder,
        }
      );

      let regulatoryDomain: 'LBT' | 'FCC' = 'FCC';
      const regDomainCE2400 = params.userDefines.find(
        ({ key }) => key === UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400
      );
      if (regDomainCE2400?.enabled) {
        regulatoryDomain = 'LBT';
      }

      const flags: string[][] = [];
      const [manufacturer, subType, device, uploadMethod] =
        params.target.split('.');
      flags.push(['--target', `${manufacturer}.${subType}.${device}`]);
      if (subType.toLocaleLowerCase().includes('tx_')) {
        flags.push(['--tx']);
      }
      flags.push(...this.userDefinesToFlags(params.userDefines));

      if (params.type === BuildJobType.Build) {
        const firmwareBinPath = path.join(
          this.firmwaresPath,
          `${this.generateFirmwareName(config.product_name, params)}.bin`
        );
        fs.promises.writeFile(firmwareBinPath, Buffer.from([]));
        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          firmwareBinPath
        );
      }

      if (params.type === BuildJobType.ForceFlash) {
        flags.push(['--force']);
      }

      if (
        params.type === BuildJobType.BuildAndFlash ||
        params.type === BuildJobType.ForceFlash
      ) {
        flags.push(['--flash', uploadMethod]);

        return new BuildFlashFirmwareResult(true, '');
      }

      const message = `Build Job Type ${params.type} is not currently supported`;
      this.updateLogs(message);
      return new BuildFlashFirmwareResult(false, message);
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

    const firmwareName = deviceName
      ?.replace(/([^a-z0-9. ]+)/gi, '-')
      .replaceAll(' ', '_');

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
