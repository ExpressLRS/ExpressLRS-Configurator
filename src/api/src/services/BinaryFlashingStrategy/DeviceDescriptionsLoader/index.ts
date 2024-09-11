import extractZip from 'extract-zip';
import { Service } from 'typedi';
import path from 'path';
import { existsSync } from 'fs';
import { mkdirp } from 'mkdirp';
import semver from 'semver';
import FirmwareSource from '../../../models/enum/FirmwareSource';
import TargetArgs from '../../../graphql/args/Target';
import { LoggerService } from '../../../logger';
import Device from '../../../models/Device';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../../library/FirmwareDownloader';
import Mutex from '../../../library/Mutex';
import { DeviceDescription, TargetsJSONLoader } from '../TargetsJSONLoader';
import FlashingMethod from '../../../models/enum/FlashingMethod';
import Target from '../../../models/Target';
import DeviceType from '../../../models/enum/DeviceType';
import { UserDefineFilters } from '../../UserDefinesLoader';
import UserDefine from '../../../models/UserDefine';
import TargetUserDefinesFactory from '../../../factories/TargetUserDefinesFactory';
import UserDefineKey from '../../../library/FirmwareBuilder/Enum/UserDefineKey';
import PullRequest from '../../../models/PullRequest';
import { removeDirectoryContents } from '../../FlashingStrategyLocator/artefacts';
import AmazonS3 from '../../../library/AmazonS3';

export interface GitRepository {
  url: string;
  srcFolder: string;
  hardwareArtifactUrl: string | null;
}

export interface FirmwareVersion {
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}

@Service()
export default class DeviceDescriptionsLoader {
  targetsMutex: Mutex;

  deviceOptionsMutex: Mutex;

  constructor(
    private logger: LoggerService,
    private PATH: string,
    private targetStorageGitPath: string,
    private deviceOptionsGitPath: string
  ) {
    this.targetsMutex = new Mutex();
    this.deviceOptionsMutex = new Mutex();
  }

  private uploadMethodToFlashingMethod(
    uploadMethod: string
  ): FlashingMethod | null {
    switch (uploadMethod.toLowerCase()) {
      case 'betaflight':
        return FlashingMethod.BetaflightPassthrough;
      case 'dfu':
        return FlashingMethod.DFU;
      case 'etx':
        return FlashingMethod.EdgeTxPassthrough;
      case 'passthru':
        return FlashingMethod.Passthrough;
      case 'stlink':
        return FlashingMethod.STLink;
      case 'uart':
        return FlashingMethod.UART;
      case 'wifi':
        return FlashingMethod.WIFI;
      case 'stock':
        return FlashingMethod.Stock_BL;
      case 'zip':
        return FlashingMethod.Zip;
      default:
        this.logger.warn(`Upload Method ${uploadMethod} Not Recognized!`);
        return null;
    }
  }

  private configToDevice(
    id: string,
    category: string,
    config: DeviceDescription
  ): Device {
    const uploadMethods: Target[] = config.upload_methods
      .filter(
        (uploadMethod) =>
          this.uploadMethodToFlashingMethod(uploadMethod) !== null
      )
      .map((uploadMethod) => {
        const targetName = `${id}.${uploadMethod}`;
        const mappedUploadMethod =
          this.uploadMethodToFlashingMethod(uploadMethod);
        return new Target(targetName, targetName, mappedUploadMethod!);
      });
    return new Device(
      id,
      config.product_name,
      category,
      uploadMethods,
      [],
      DeviceType.ExpressLRS,
      true,
      undefined,
      undefined,
      undefined,
      config.lua_name,
      config.prior_target_name,
      config.platform
    );
  }

  async loadTargetsList(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]> {
    let targetsDataDirectory = '';
    await this.targetsMutex.tryLockWithTimeout(15 * 60 * 1000);
    try {
      targetsDataDirectory = await this.loadTargetsData(
        this.targetStorageGitPath,
        args,
        gitRepository
      );
    } finally {
      this.targetsMutex.unlock();
    }

    const targetsJSONLoader = new TargetsJSONLoader(this.logger);
    const targetsJSONPath = path.join(targetsDataDirectory, 'targets.json');
    const data = await targetsJSONLoader.loadDeviceDescriptions(
      targetsJSONPath
    );
    const devices: Device[] = [];
    Object.keys(data).forEach((id) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { min_version } = data[id].config;
      if (
        !min_version ||
        args.source !== FirmwareSource.GitTag ||
        semver.gte(args.gitTag, min_version)
      ) {
        devices.push(
          this.configToDevice(id, data[id].category, data[id].config)
        );
      }
    });
    return devices;
  }

  private async loadTargetsData(
    gitRepositoryPath: string,
    args: FirmwareVersion,
    gitRepository: GitRepository
  ): Promise<string> {
    let gitPath = '';
    try {
      gitPath = await findGitExecutable(this.PATH);
    } catch (e) {
      this.logger?.error('failed to find git', undefined, {
        PATH: this.PATH,
        err: e,
      });
      throw e;
    }
    this.logger?.log('git path', {
      gitPath,
    });

    if (
      args.source === FirmwareSource.Local &&
      existsSync(path.join(args.localPath, 'hardware'))
    ) {
      return path.join(args.localPath, 'hardware');
    }

    if (gitRepository.hardwareArtifactUrl) {
      const workingDir = path.join(gitRepositoryPath, 'hardware');
      await mkdirp(workingDir);
      const outputZipFile = path.join(workingDir, 'hardware.zip');

      if (
        await new AmazonS3().downloadIfModified(
          gitRepository.hardwareArtifactUrl,
          outputZipFile
        )
      ) {
        await extractZip(outputZipFile, {
          dir: workingDir,
        });
      }

      return workingDir;
    }

    const firmwareDownload = new GitFirmwareDownloader(
      {
        baseDirectory: gitRepositoryPath,
        gitBinaryLocation: gitPath,
      },
      this.logger
    );

    const srcFolder =
      gitRepository.srcFolder === '/' ? '' : `${gitRepository.srcFolder}/`;
    switch (args.source) {
      case FirmwareSource.GitBranch:
        const branchResult = await firmwareDownload.checkoutBranch(
          gitRepository.url,
          `${srcFolder}hardware`,
          args.gitBranch
        );
        return branchResult.path;
      case FirmwareSource.GitCommit:
        const commitResult = await firmwareDownload.checkoutCommit(
          gitRepository.url,
          `${srcFolder}hardware`,
          args.gitCommit
        );
        return commitResult.path;
      case FirmwareSource.GitTag:
        const tagResult = await firmwareDownload.checkoutTag(
          gitRepository.url,
          `${srcFolder}hardware`,
          args.gitTag
        );
        return tagResult.path;
      case FirmwareSource.GitPullRequest:
        if (args.gitPullRequest === null) {
          throw new Error('empty GitPullRequest head commit hash');
        }
        const prResult = await firmwareDownload.checkoutCommit(
          gitRepository.url,
          `${srcFolder}hardware`,
          args.gitPullRequest.headCommitHash
        );
        return prResult.path;
      case FirmwareSource.Local:
        return path.join(args.localPath, 'hardware');
      default:
        throw new Error(
          `unsupported firmware source for the targets service: ${args.source}`
        );
    }
  }

  private splitLastOccurrence(
    str: string,
    substring: string
  ): [string, string] {
    const lastIndex = str.lastIndexOf(substring);

    const before = str.slice(0, lastIndex);

    const after = str.slice(lastIndex + 1);

    return [before, after];
  }

  async getDeviceConfig(
    args: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<DeviceDescription> {
    let targetsDataDirectory = '';
    await this.deviceOptionsMutex.tryLockWithTimeout(15 * 60 * 1000);
    try {
      targetsDataDirectory = await this.loadTargetsData(
        this.deviceOptionsGitPath,
        args,
        gitRepository
      );
    } finally {
      this.deviceOptionsMutex.unlock();
    }

    const targetsJSONLoader = new TargetsJSONLoader(this.logger);
    const targetsJSONPath = path.join(targetsDataDirectory, 'targets.json');
    const data = await targetsJSONLoader.loadDeviceDescriptions(
      targetsJSONPath
    );

    /*
      axis.tx_2400.thor.uart split at last index gives us axis.tx_2400.thor.
     */
    const [target] = this.splitLastOccurrence(args.target, '.');

    if (typeof data[target] === 'undefined') {
      throw new Error(`failed to find device description for ${args.target}`);
    }
    const { config } = data[target];
    this.logger.log('device config', {
      target,
      config,
    });

    return config;
  }

  async targetDeviceOptions(
    args: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    const config = await this.getDeviceConfig(args, gitRepository);

    const userDefines: UserDefine[] = [];
    const targetUserDefinesFactory = new TargetUserDefinesFactory(
      config.platform
    );
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
    if (args.target.includes('tx_dual')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.REGULATORY_DOMAIN_ISM_2400)
      );
    }
    if (args.target.includes('_900.') || args.target.includes('tx_dual')) {
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
    if (config.upload_methods.includes('wifi')) {
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.HOME_WIFI_SSID)
      );
      userDefines.push(
        targetUserDefinesFactory.build(UserDefineKey.HOME_WIFI_PASSWORD)
      );
      if (!config.firmware.endsWith('_Backpack')) {
        userDefines.push(
          targetUserDefinesFactory.build(UserDefineKey.AUTO_WIFI_ON_INTERVAL)
        );
      }
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
        targetUserDefinesFactory.build(UserDefineKey.LOCK_ON_FIRST_CONNECTION)
      );
      if (config.platform !== 'stm32') {
        userDefines.push(
          targetUserDefinesFactory.build(UserDefineKey.RX_AS_TX)
        );
      }
    }
    return userDefines;
  }

  async clearCache() {
    await this.targetsMutex.tryLockWithTimeout(60000);
    try {
      await removeDirectoryContents(this.targetStorageGitPath);
    } finally {
      this.targetsMutex.unlock();
    }

    await this.deviceOptionsMutex.tryLockWithTimeout(60000);
    try {
      await removeDirectoryContents(this.deviceOptionsGitPath);
    } finally {
      this.deviceOptionsMutex.unlock();
    }
  }
}
