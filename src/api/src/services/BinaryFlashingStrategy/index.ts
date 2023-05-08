/* eslint-disable no-bitwise */
import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as os from 'os';
import semver from 'semver';
import path from 'path';
import fs from 'fs';
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
  createBinaryCopyWithCanonicalName,
  removeDirectoryContents,
} from '../FlashingStrategyLocator/artefacts';
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
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import DeviceDescriptionsLoader from './DeviceDescriptionsLoader';
import { FirmwareVersionData } from '../FlashingStrategyLocator/FirmwareVersionData';
import Platformio from '../../library/Platformio';
import FirmwareBuilder from '../../library/FirmwareBuilder';
import UserDefinesMode from '../../models/enum/UserDefinesMode';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';
import BinaryConfigurator from './BinaryConfigurator';
import {
  maskBuildFlashFirmwareParams,
  maskSensitiveData,
} from '../FlashingStrategyLocator/masks';
import CloudBinariesCache from './CloudBinariesCache';
import { DeviceDescription } from './TargetsJSONLoader';

@Service()
export default class BinaryFlashingStrategyService implements FlashingStrategy {
  readonly name: string = 'BinaryFlashingStrategy';

  private mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private pubSub: PubSubEngine,
    private binaryConfigurator: BinaryConfigurator,
    private platformio: Platformio,
    private builder: FirmwareBuilder,
    private deviceDescriptionsLoader: DeviceDescriptionsLoader,
    private cloudBinariesCache: CloudBinariesCache,
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

  async isCompatible(params: IsCompatibleArgs, gitRepository: GitRepository) {
    if (
      gitRepository.url.toLowerCase() !==
      'https://github.com/expresslrs/expresslrs'.toLowerCase()
    ) {
      return false;
    }

    if (
      params.source === FirmwareSource.GitTag &&
      semver.lt(params.gitTag, '3.0.0')
    ) {
      return false;
    }

    return true;
  }

  async downloadSource(
    firmware: FirmwareVersionData,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
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

    const firmwareDownload = new GitFirmwareDownloader(
      {
        baseDirectory: this.firmwaresPath,
        gitBinaryLocation: gitPath,
      },
      this.logger
    );

    let firmwarePath = '';
    switch (firmware.source) {
      case FirmwareSource.GitTag:
        const tagResult = await firmwareDownload.checkoutTag(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitTag
        );
        firmwarePath = tagResult.path;
        break;
      case FirmwareSource.GitBranch:
        const branchResult = await firmwareDownload.checkoutBranch(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitBranch
        );
        firmwarePath = branchResult.path;
        break;
      case FirmwareSource.GitCommit:
        const commitResult = await firmwareDownload.checkoutCommit(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitCommit
        );
        firmwarePath = commitResult.path;
        break;
      case FirmwareSource.Local:
        firmwarePath = firmware.localPath;
        break;
      case FirmwareSource.GitPullRequest:
        if (firmware.gitPullRequest) {
          const pullRequestResult = await firmwareDownload.checkoutCommit(
            gitRepositoryUrl,
            gitRepositorySrcFolder,
            firmware.gitPullRequest.headCommitHash
          );
          firmwarePath = pullRequestResult.path;
        }
        break;
      default:
        throw new Error(`unsupported firmware source: ${firmware.source}`);
    }
    this.logger?.log('firmware path', {
      firmwarePath,
      gitRepositoryUrl,
    });
    return firmwarePath;
  }

  async getCurrentSourceCommit(gitRepositoryUrl: string): Promise<string> {
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

    const firmwareDownload = new GitFirmwareDownloader(
      {
        baseDirectory: this.firmwaresPath,
        gitBinaryLocation: gitPath,
      },
      this.logger
    );

    return firmwareDownload.currentCommitHash(gitRepositoryUrl);
  }

  isRequestCompatibleWithCache(params: BuildFlashFirmwareParams): boolean {
    if (params.userDefinesMode === UserDefinesMode.Manual) {
      return false;
    }

    if (params.firmware.source === FirmwareSource.Local) {
      return false;
    }

    return true;
  }

  async compileBinary(
    target: string,
    firmwareSourcePath: string,
    userDefinesMode: UserDefinesMode,
    userDefinesTxt: string,
    userDefines: UserDefine[]
  ): Promise<string> {
    const pythonCheck = await this.platformio.checkPython();
    if (!pythonCheck.success) {
      this.logger?.error('python dependency check error', undefined, {
        stderr: pythonCheck.stderr,
        stdout: pythonCheck.stdout,
      });
      throw new Error(
        `Python dependency error: ${pythonCheck.stderr} ${pythonCheck.stdout}`
      );
    }

    const coreCheck = await this.platformio.checkCore();
    if (!coreCheck.success) {
      await this.updateLogs(
        'Failed to find Platformio on your computer. Trying to install it automatically...'
      );
      this.logger?.error('platformio dependency check error', undefined, {
        stderr: coreCheck.stderr,
        stdout: coreCheck.stdout,
      });
      const platformioInstallResult = await this.platformio.install(
        (output) => {
          this.updateLogs(output);
        }
      );
      if (!platformioInstallResult.success) {
        this.logger?.error('platformio installation error', undefined, {
          stderr: platformioInstallResult.stderr,
          stdout: platformioInstallResult.stdout,
        });
        throw new Error(
          `platformio error: ${platformioInstallResult.stderr} ${platformioInstallResult.stdout}`
        );
      }
    }

    await this.updateProgress(
      BuildProgressNotificationType.Info,
      BuildFirmwareStep.BUILDING_USER_DEFINES
    );

    let buildUserDefines = '';
    switch (userDefinesMode) {
      case UserDefinesMode.Manual:
        buildUserDefines = userDefinesTxt;
        break;
      case UserDefinesMode.UserInterface:
        buildUserDefines = new UserDefinesTxtFactory().build(userDefines);
        break;
      default:
        throw new Error(`unsupported user defines mode: ${userDefinesMode}`);
    }

    const platformioStateJson = await this.platformio.getPlatformioState();
    this.logger?.log('platformio state json', {
      platformioStateJson,
    });

    await this.updateProgress(
      BuildProgressNotificationType.Info,
      BuildFirmwareStep.BUILDING_FIRMWARE
    );
    const compileResult = await this.builder.build(
      target,
      buildUserDefines,
      firmwareSourcePath,
      (output) => {
        this.updateLogs(output);
      }
    );
    if (!compileResult.success) {
      this.logger?.error('compile error', undefined, {
        code: compileResult.code,
        stderr: compileResult.stderr,
        stdout: compileResult.stdout,
      });
      throw new Error(`failed to compile firmware: ${compileResult.stderr}`);
    }

    return this.builder.getFirmwareBinPath(target, firmwareSourcePath);
  }

  async getCachedBuildPath(
    platformioTarget: string,
    userDefines: UserDefine[]
  ): Promise<string> {
    let regulatoryDomain: 'LBT' | 'FCC' = 'FCC';
    const regDomainCE2400 = userDefines.find(
      ({ key }) => key === UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400
    );
    if (regDomainCE2400?.enabled) {
      regulatoryDomain = 'LBT';
    }
    return `${regulatoryDomain}/${platformioTarget}/firmware.bin`;
  }

  getCompileTarget(config: DeviceDescription): string {
    let target = `${config.firmware}_via_UART`;
    if (config.upload_methods.includes('stlink')) {
      target = `${config.firmware}_via_STLINK`;
    }
    return target;
  }

  async buildFlashFirmware(
    params: BuildFlashFirmwareParams,
    gitRepository: GitRepository
  ): Promise<BuildFlashFirmwareResult> {
    const gitRepositoryUrl = gitRepository.url;
    const gitRepositorySrcFolder = gitRepository.srcFolder;
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
      const firmwareSourcePath = await this.downloadSource(
        params.firmware,
        gitRepositoryUrl,
        gitRepositorySrcFolder
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

      let firmwareBinaryPath = '';
      let hardwareDefinitionsPath = firmwareSourcePath;
      let flasherPath = path.join(
        firmwareSourcePath,
        'python',
        'binary_configurator.py'
      );
      if (this.isRequestCompatibleWithCache(params)) {
        const currentCommitHash = await this.getCurrentSourceCommit(
          gitRepositoryUrl
        );
        this.logger.log('firmware build request is compatible with cache', {
          currentCommitHash,
        });
        try {
          const cacheLocation = await this.cloudBinariesCache.download(
            gitRepository.repositoryName,
            currentCommitHash
          );
          const cachedBinaryPath = await this.getCachedBuildPath(
            config.firmware,
            params.userDefines
          );
          firmwareBinaryPath = path.join(cacheLocation, cachedBinaryPath);

          const flasherPyzPath = path.join(cacheLocation, 'flasher.pyz');
          if (fs.existsSync(flasherPyzPath)) {
            flasherPath = flasherPyzPath;
          }
          hardwareDefinitionsPath = cacheLocation;
        } catch (e) {
          this.logger.log(
            'failed to get cached build, reverting to building firmware locally',
            {
              e,
              currentCommitHash,
            }
          );
          const target = this.getCompileTarget(config);
          firmwareBinaryPath = await this.compileBinary(
            target,
            firmwareSourcePath,
            params.userDefinesMode,
            params.userDefinesTxt,
            params.userDefines
          );
        }
      } else {
        const target = this.getCompileTarget(config);
        firmwareBinaryPath = await this.compileBinary(
          target,
          firmwareSourcePath,
          params.userDefinesMode,
          params.userDefinesTxt,
          params.userDefines
        );
      }
      this.logger.log('firmware binaries path', {
        firmwareBinaryPath,
      });

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.BUILDING_FIRMWARE
      );

      const flags: string[][] =
        this.binaryConfigurator.buildBinaryConfigFlags(params);
      const binaryConfiguratorResult = await this.binaryConfigurator.run(
        firmwareSourcePath,
        hardwareDefinitionsPath,
        flasherPath,
        firmwareBinaryPath,
        flags,
        (output) => {
          this.updateLogs(output);
        }
      );
      if (!binaryConfiguratorResult.success) {
        this.logger?.error('compile error', undefined, {
          code: binaryConfiguratorResult.code,
          stderr: binaryConfiguratorResult.stderr,
          stdout: binaryConfiguratorResult.stdout,
        });
        return new BuildFlashFirmwareResult(
          false,
          binaryConfiguratorResult.stderr,
          BuildFirmwareErrorType.BuildError
        );
      }

      if (params.type === BuildJobType.Build) {
        const canonicalBinPath = await createBinaryCopyWithCanonicalName(
          params,
          firmwareBinaryPath
        );
        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          canonicalBinPath
        );
      }

      if (
        params.type === BuildJobType.BuildAndFlash ||
        params.type === BuildJobType.ForceFlash
      ) {
        return new BuildFlashFirmwareResult(true, '');
      }

      return new BuildFlashFirmwareResult(
        false,
        `Build Job Type ${params.type} is not currently supported`
      );
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

  async clearFirmwareFiles(): Promise<void> {
    await this.deviceDescriptionsLoader.clearCache();

    this.logger.log('BinaryConfigurator - clearFirmwareFiles', {
      firmwaresPath: this.firmwaresPath,
    });
    return removeDirectoryContents(this.firmwaresPath);
  }
}
