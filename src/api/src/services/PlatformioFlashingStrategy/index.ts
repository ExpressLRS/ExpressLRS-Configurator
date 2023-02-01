import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as os from 'os';
import BuildJobType from '../../models/enum/BuildJobType';
import UserDefinesMode from '../../models/enum/UserDefinesMode';
import UserDefine from '../../models/UserDefine';
import FirmwareSource from '../../models/enum/FirmwareSource';
import BuildFlashFirmwareResult from '../../graphql/objects/BuildFlashFirmwareResult';
import Mutex from '../../library/Mutex';
import BuildFirmwareErrorType from '../../models/enum/BuildFirmwareErrorType';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import Platformio from '../../library/Platformio';
import FirmwareBuilder from '../../library/FirmwareBuilder';
import { LoggerService } from '../../logger';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import UploadType from '../../library/Platformio/Enum/UploadType';
import { BuildFlashFirmwareParams } from '../FlashingStrategyLocator/BuildFlashFirmwareParams';
import {
  createBinaryCopyWithCanonicalName,
  removeDirectoryContents,
} from '../FlashingStrategyLocator/artefacts';
import {
  FlashingStrategy,
  IsCompatibleArgs,
} from '../FlashingStrategyLocator/FlashingStrategy';
import UserDefinesBuilder from '../UserDefinesBuilder';
import TargetsLoader from '../TargetsLoader';
import TargetArgs from '../../graphql/args/Target';
import Device from '../../models/Device';
import { UserDefineFilters } from '../UserDefinesLoader';
import GitRepository from '../../graphql/inputs/GitRepositoryInput';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';
import {
  maskBuildFlashFirmwareParams,
  maskSensitiveData,
} from '../FlashingStrategyLocator/masks';

@Service()
export default class PlatformioFlashingStrategyService
  implements FlashingStrategy
{
  readonly name: string = 'PlatformioFlashingStrategy';

  mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private platformio: Platformio,
    private builder: FirmwareBuilder,
    private pubSub: PubSubEngine,
    private logger: LoggerService,
    private userDefinesBuilder: UserDefinesBuilder,
    private targetsLoader: TargetsLoader
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

  async availableFirmwareTargets(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]> {
    return this.targetsLoader.loadTargetsList(args, gitRepository);
  }

  async targetDeviceOptions(
    args: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    return this.userDefinesBuilder.loadForDevice(args, gitRepository);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: IsCompatibleArgs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _gitRepositoryUrl: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _gitRepositorySrcFolder: string
  ) {
    return true;
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

      const pythonCheck = await this.platformio.checkPython();
      if (!pythonCheck.success) {
        this.logger?.error('python dependency check error', undefined, {
          stderr: pythonCheck.stderr,
          stdout: pythonCheck.stdout,
        });
        return new BuildFlashFirmwareResult(
          false,
          `Python dependency error: ${pythonCheck.stderr} ${pythonCheck.stdout}`,
          BuildFirmwareErrorType.PythonDependencyError
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
          return new BuildFlashFirmwareResult(
            false,
            `platformio error: ${platformioInstallResult.stderr} ${platformioInstallResult.stdout}`,
            BuildFirmwareErrorType.PlatformioDependencyError
          );
        }
      }

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
        BuildFirmwareStep.BUILDING_USER_DEFINES
      );
      if (
        params.userDefinesMode === UserDefinesMode.UserInterface &&
        params.firmware.source !== FirmwareSource.Local
      ) {
        const compatCheck =
          await this.builder.checkDefaultUserDefinesCompatibilityAtPath(
            firmwarePath,
            params.userDefines
              .filter(
                (userDefine) =>
                  userDefine.enabled &&
                  userDefine.key !== UserDefineKey.DEVICE_NAME
              )
              .map(({ key }) => key)
          );
        if (!compatCheck.compatible) {
          return new BuildFlashFirmwareResult(
            false,
            `Downloaded firmware is not compatible with the following user defines: ${compatCheck.incompatibleKeys}`,
            BuildFirmwareErrorType.BuildError
          );
        }
      }

      let userDefines = '';
      switch (params.userDefinesMode) {
        case UserDefinesMode.Manual:
          userDefines = params.userDefinesTxt;
          break;
        case UserDefinesMode.UserInterface:
          userDefines = new UserDefinesTxtFactory().build(params.userDefines);
          break;
        default:
          throw new Error(
            `unsupported user defines mode: ${params.userDefinesMode}`
          );
      }

      const platformioStateJson = await this.platformio.getPlatformioState();
      this.logger?.log('platformio state json', {
        platformioStateJson,
      });

      if (params.type === BuildJobType.Build) {
        await this.updateProgress(
          BuildProgressNotificationType.Info,
          BuildFirmwareStep.BUILDING_FIRMWARE
        );
        const compileResult = await this.builder.build(
          params.target,
          userDefines,
          firmwarePath,
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
          return new BuildFlashFirmwareResult(
            false,
            compileResult.stderr,
            BuildFirmwareErrorType.BuildError
          );
        }

        const firmwareBinPath = this.builder.getFirmwareBinPath(
          params.target,
          firmwarePath
        );
        const canonicalFirmwareBinPath =
          await createBinaryCopyWithCanonicalName(params, firmwareBinPath);

        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          canonicalFirmwareBinPath
        );
      }

      if (
        params.type === BuildJobType.BuildAndFlash ||
        params.type === BuildJobType.ForceFlash
      ) {
        await this.updateProgress(
          BuildProgressNotificationType.Info,
          BuildFirmwareStep.FLASHING_FIRMWARE
        );

        let uploadType: UploadType;
        switch (params.type) {
          case BuildJobType.BuildAndFlash:
            uploadType = UploadType.Normal;
            break;
          case BuildJobType.ForceFlash:
            uploadType = UploadType.Force;
            break;
          default:
            throw new Error(`Unknown build job type ${params.type}`);
        }

        const flashResult = await this.builder.flash(
          params.target,
          userDefines,
          firmwarePath,
          params.serialDevice,
          uploadType,
          (output) => {
            this.updateLogs(output);
          }
        );
        if (!flashResult.success) {
          this.logger?.error('flash error', undefined, {
            stderr: flashResult.stderr,
            stdout: flashResult.stdout,
          });
          const uploadErrorRegexp = /\*\*\* \[upload\] Error (-*\d+)/g;
          let uploadError = 0;
          const matches = [...flashResult.stderr.matchAll(uploadErrorRegexp)];
          if (matches.length > 0) {
            uploadError = Number.parseInt(matches[0][1], 10);
          }
          return new BuildFlashFirmwareResult(
            false,
            flashResult.stderr,
            uploadError === -2
              ? BuildFirmwareErrorType.TargetMismatch
              : BuildFirmwareErrorType.FlashError
          );
        }
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

  async clearFirmwareFiles(): Promise<void> {
    await this.targetsLoader.clearCache();

    this.logger.log('PlatformioConfigurator - clearFirmwareFiles', {
      firmwaresPath: this.firmwaresPath,
    });
    return removeDirectoryContents(this.firmwaresPath);
  }
}
