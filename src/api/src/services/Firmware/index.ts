import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import BuildJobType from '../../models/enum/BuildJobType';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';
import UserDefinesMode from '../../models/enum/UserDefinesMode';
import UserDefine from '../../models/UserDefine';
import FirmwareSource from '../../models/enum/FirmwareSource';
import BuildFlashFirmwareResult from '../../models/BuildFlashFirmwareResult';
import Mutex from '../../library/Mutex';
import BuildFirmwareErrorType from '../../models/enum/BuildFirmwareErrorType';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';
import Platformio from '../../library/Platformio';
import FirmwareBuilder from '../../library/FirmwareBuilder';
import { LoggerService } from '../../logger';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

export interface GitRepo {
  url: string;
  cloneUrl: string;
  owner: string;
  repositoryName: string;
}

interface FirmwareVersionData {
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
}

interface BuildFlashFirmwareParams {
  type: BuildJobType;
  serialDevice?: string | undefined;
  firmware: FirmwareVersionData;
  target: DeviceTarget;
  userDefinesMode: UserDefinesMode;
  userDefines: UserDefine[];
  userDefinesTxt: string;
}

export interface BuildProgressNotificationPayload {
  type: BuildProgressNotificationType;
  step?: BuildFirmwareStep;
  message?: string;
}

export interface BuildLogUpdatePayload {
  data: string;
}

@Service()
export default class FirmwareService {
  mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private platformio: Platformio,
    private builder: FirmwareBuilder,
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
    this.logger?.log('logs stream output', {
      data,
    });
    return this.pubSub!.publish(PubSubTopic.BuildLogsUpdate, {
      data,
    });
  }

  private processUserDefines(userDefines: UserDefine[]): UserDefine[] {
    const overrideUserDefineTo = (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      userDefines: UserDefine[],
      defaultUserDefine: UserDefine
    ): UserDefine[] => {
      const exists =
        userDefines.find(({ key }) => key === defaultUserDefine.key) !==
        undefined;
      if (exists) {
        return userDefines.map((item) => {
          if (item.key === defaultUserDefine.key) {
            return defaultUserDefine;
          }
          return item;
        });
      }
      return [...userDefines, defaultUserDefine];
    };
    const overrides = [
      UserDefine.Boolean(UserDefineKey.FAST_SYNC, true),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_50HZ, false),
    ];
    let result = userDefines;
    overrides.forEach((override) => {
      result = overrideUserDefineTo(result, override);
    });
    return result;
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

  async buildFlashFirmware(
    params: BuildFlashFirmwareParams,
    gitRepo: GitRepo
  ): Promise<BuildFlashFirmwareResult> {
    this.logger?.log('received build firmware request', {
      params,
      gitRepo,
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
        this.logger?.error('failed to find git', e.stack, {
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

      const firmwareDownload = new GitFirmwareDownloader({
        baseDirectory: this.firmwaresPath,
        gitBinaryLocation: gitPath,
      });

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.DOWNLOADING_FIRMWARE
      );
      let firmwarePath = '';
      switch (params.firmware.source) {
        case FirmwareSource.GitTag:
          const tagResult = await firmwareDownload.checkoutTag(
            gitRepo.url,
            params.firmware.gitTag
          );
          firmwarePath = tagResult.path;
          break;
        case FirmwareSource.GitBranch:
          const branchResult = await firmwareDownload.checkoutBranch(
            gitRepo.url,
            params.firmware.gitBranch
          );
          firmwarePath = branchResult.path;
          break;
        case FirmwareSource.GitCommit:
          const commitResult = await firmwareDownload.checkoutCommit(
            gitRepo.url,
            params.firmware.gitCommit
          );
          firmwarePath = commitResult.path;
          break;
        case FirmwareSource.Local:
          firmwarePath = params.firmware.localPath;
          break;
        default:
          throw new Error(
            `unsupported firmware source: ${params.firmware.source}`
          );
      }
      this.logger?.log('firmware path', {
        firmwarePath,
      });

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.BUILDING_USER_DEFINES
      );
      if (
        params.userDefinesMode === UserDefinesMode.UserInterface &&
        params.firmware.source !== FirmwareSource.Local
      ) {
        const compatCheck = await this.builder.checkDefaultUserDefinesCompatibilityAtPath(
          firmwarePath,
          params.userDefines
            .filter((userDefine) => userDefine.enabled)
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

      const userDefinesBuilder = new UserDefinesTxtFactory();
      let userDefines = '';
      switch (params.userDefinesMode) {
        case UserDefinesMode.Manual:
          userDefines = params.userDefinesTxt;
          break;
        case UserDefinesMode.UserInterface:
          userDefines = userDefinesBuilder.build(
            this.processUserDefines(params.userDefines)
          );
          break;
        default:
          throw new Error(
            `unsupported user defines mode: ${params.userDefinesMode}`
          );
      }
      this.logger?.log('user_defines.txt', {
        userDefines,
      });

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
            stderr: compileResult.stderr,
            stdout: compileResult.stdout,
          });
          return new BuildFlashFirmwareResult(
            false,
            compileResult.stderr,
            BuildFirmwareErrorType.BuildError
          );
        }

        let firmwareBinPath = this.builder.getFirmwareBinPath(
          params.target,
          firmwarePath
        );

        if (fs.existsSync(firmwareBinPath)) {
          const newFirmwareBaseName = this.generateFirmwareName(params);
          const firmwareExtension = path.extname(firmwareBinPath);

          const tmpPath = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), `${params.target}_`)
          );

          const tmpFirmwareBinPath = path.join(
            tmpPath,
            `${newFirmwareBaseName}${firmwareExtension}`
          );

          try {
            await fs.promises.copyFile(firmwareBinPath, tmpFirmwareBinPath);
            firmwareBinPath = tmpFirmwareBinPath;
          } catch (err) {
            this.logger?.error(
              `error copying file from ${firmwareBinPath} to ${tmpFirmwareBinPath}: ${err}`
            );
          }
        }

        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          firmwareBinPath
        );
      }

      if (params.type === BuildJobType.BuildAndFlash) {
        await this.updateProgress(
          BuildProgressNotificationType.Info,
          BuildFirmwareStep.FLASHING_FIRMWARE
        );
        const flashResult = await this.builder.flash(
          params.target,
          userDefines,
          firmwarePath,
          params.serialDevice,
          (output) => {
            this.updateLogs(output);
          }
        );
        if (!flashResult.success) {
          this.logger?.error('flash error', undefined, {
            stderr: flashResult.stderr,
            stdout: flashResult.stdout,
          });
          return new BuildFlashFirmwareResult(
            false,
            flashResult.stderr,
            BuildFirmwareErrorType.FlashError
          );
        }
      }

      return new BuildFlashFirmwareResult(true);
    } catch (e) {
      this.logger?.error('generic error', e.trace, {
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

  generateFirmwareName(params: BuildFlashFirmwareParams): string {
    const { source, gitBranch, gitCommit, gitTag } = params.firmware;
    let target = params.target.toString();

    const viaIndex = params.target?.lastIndexOf('_via');
    if (viaIndex > 0) {
      target = target.substring(0, viaIndex);
    }

    switch (source) {
      case FirmwareSource.GitTag:
        return `${target}-${gitTag}`;
      case FirmwareSource.GitBranch:
        return `${target}-${gitBranch}`;
      case FirmwareSource.GitCommit:
        return `${target}-${gitCommit}`;
      default:
        return `${target}`;
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
    if (files.length > 3) {
      throw new Error(`unexpected number of files to remove: ${files}`);
    }
    await Promise.all(files.map((item) => rmrf(item)));
  }

  async clearPlatformioCoreDir(): Promise<void> {
    const platformioStateJson = await this.platformio.getPlatformioState();
    if (
      platformioStateJson.core_dir === undefined ||
      platformioStateJson.core_dir.length === 0 ||
      platformioStateJson.core_dir.indexOf('.platformio') === -1
    ) {
      throw new Error(`core_dir is invalid: ${platformioStateJson.core_dir}`);
    }

    const statResult = await fs.promises.lstat(platformioStateJson.core_dir);
    if (!statResult.isDirectory()) {
      throw new Error(`core_dir is invalid: ${platformioStateJson.core_dir}`);
    }

    return new Promise((resolve, reject) => {
      rimraf(platformioStateJson.core_dir, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}
