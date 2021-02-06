import { app, IpcMainEvent, shell } from 'electron';
import path from 'path';
import mkdirp from 'mkdirp';
import Mutex from '../../../library/Mutex';
import { MainResponseType, PushMessageType } from '../../../ipc';
import Platformio from '../../../library/Platformio';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../../library/FirmwareDownloader';
import { Config } from '../../../config';
import UserDefinesTxtBuilder from '../../../library/FirmwareBuilder/UserDefinesTxtBuilder';
import FirmwareBuilder from '../../../library/FirmwareBuilder';
import { DeviceTarget } from '../../../library/FirmwareBuilder/Enum/DeviceTarget';
import { UserDefine } from '../../../library/FirmwareBuilder/Model/UserDefine';

export enum BuildFirmWareProgressNotificationType {
  Success = 'SUCCESS',
  Info = 'INFO',
  Error = 'ERROR',
}

export interface BuildFlashFirmwareResponseBody {
  success: boolean;
  errorType?: BuildFirmwareErrorType;
  message?: string;
}

export enum BuildFirmwareStep {
  VERIFYING_BUILD_SYSTEM = 'VERIFYING_BUILD_SYSTEM',
  DOWNLOADING_FIRMWARE = 'DOWNLOADING_FIRMWARE',
  BUILDING_USER_DEFINES = 'BUILDING_USER_DEFINES',
  BUILDING_FIRMWARE = 'BUILDING_FIRMWARE',
  FLASHING_FIRMWARE = 'FLASHING_FIRMWARE',
}

export enum BuildFirmwareErrorType {
  PythonDependencyError = 'PYTHON_DEPENDENCY_ERROR',
  PlatformioDependencyError = 'PLATFORMIO_DEPENDENCY_ERROR',
  GitDependencyError = 'GIT_DEPENDENCY_ERROR',
  BuildError = 'BUILD_ERROR',
  FlashError = 'FLASH_ERROR',
  GenericError = 'GENERIC_ERROR',
}

export enum FirmwareSource {
  GitTag = 'GIT_RELEASE',
  GitBranch = 'GIT_BRANCH',
  GitCommit = 'GIT_COMMIT',
  Local = 'LOCAL',
}

export interface FirmwareVersionData {
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
}

export enum UserDefinesMode {
  UserInterface = 'USER_INTERFACE',
  Manual = 'MANUAL',
}

export enum JobType {
  Build = 'BUILD',
  BuildAndFlash = 'BUILD_AND_FLABuildFirmwareErrorTypeSH',
}

export interface BuildFirmwareHandlerProps {
  PATH: string;
  platformio: Platformio;
  firmwareBuilder: FirmwareBuilder;
}

// Split in progress notifications and errors
export interface BuildFirmWareProgressNotificationData {
  jobType: JobType;
  type: BuildFirmWareProgressNotificationType;
  step?: BuildFirmwareStep;
  message?: string;
}

export interface BuildFlashFirmwareRequestBody {
  type: JobType;
  firmware: FirmwareVersionData;
  target: DeviceTarget;
  userDefinesMode: UserDefinesMode;
  userDefines: UserDefine[];
  userDefinesTxt: string;
}

export default class BuildFirmwareHandler {
  private mutex: Mutex;

  private PATH: string;

  private platformio: Platformio;

  private builder: FirmwareBuilder;

  constructor({
    PATH,
    platformio,
    firmwareBuilder,
  }: BuildFirmwareHandlerProps) {
    this.mutex = new Mutex();
    this.PATH = PATH;
    this.platformio = platformio;
    this.builder = firmwareBuilder;
  }

  async processRequest(
    event: IpcMainEvent,
    req: BuildFlashFirmwareRequestBody
  ) {
    if (this.mutex.isLocked()) {
      console.error('there is another build/flash request in progress...');
      return;
    }
    this.mutex.tryLock();

    const updateProgress = (data: BuildFirmWareProgressNotificationData) => {
      event.reply(PushMessageType.FlashFirmWareProgressNotification, data);
    };
    const sendResponse = (body: BuildFlashFirmwareResponseBody) => {
      event.reply(MainResponseType.BuildFlashFirmware, body);
      this.mutex.unlock();
    };
    const sendLogs = (data: string) => {
      event.reply(PushMessageType.BuildFlashLogEntry, data);
    };

    try {
      updateProgress({
        jobType: req.type,
        type: BuildFirmWareProgressNotificationType.Info,
        step: BuildFirmwareStep.VERIFYING_BUILD_SYSTEM,
      });
      const pythonCheck = await this.platformio.checkPython();
      if (!pythonCheck.success) {
        sendResponse({
          success: false,
          errorType: BuildFirmwareErrorType.PythonDependencyError,
          message: `Python dependency error: ${pythonCheck.stderr} ${pythonCheck.stdout}`,
        });
        return;
      }

      const coreCheck = await this.platformio.checkCore();
      if (!coreCheck.success) {
        sendLogs(
          'Failed to find Platformio on your computer. Trying to install it automatically...'
        );
        const platformioInstallResult = await this.platformio.install(sendLogs);
        if (!platformioInstallResult.success) {
          sendResponse({
            success: false,
            message: `platformio error: ${platformioInstallResult.stderr} ${platformioInstallResult.stdout}`,
            errorType: BuildFirmwareErrorType.PlatformioDependencyError,
          });
          return;
        }
      }

      let gitPath = '';
      try {
        gitPath = await findGitExecutable(this.PATH);
      } catch (e) {
        sendResponse({
          success: false,
          errorType: BuildFirmwareErrorType.GitDependencyError,
          message: `${e}`,
        });
        return;
      }
      const firmwaresPath = path.join(
        app.getPath('userData'),
        'firmwares',
        'git'
      );
      await mkdirp(firmwaresPath);
      const firmwareDownload = new GitFirmwareDownloader({
        baseDirectory: firmwaresPath,
        gitBinaryLocation: gitPath,
      });

      updateProgress({
        jobType: req.type,
        type: BuildFirmWareProgressNotificationType.Info,
        step: BuildFirmwareStep.DOWNLOADING_FIRMWARE,
      });
      let firmwarePath = '';
      switch (req.firmware.source) {
        case FirmwareSource.GitTag:
          const tagResult = await firmwareDownload.checkoutTag(
            Config.git.url,
            req.firmware.gitTag
          );
          firmwarePath = tagResult.path;
          break;
        case FirmwareSource.GitBranch:
          const branchResult = await firmwareDownload.checkoutTag(
            Config.git.url,
            req.firmware.gitBranch
          );
          firmwarePath = branchResult.path;
          break;
        case FirmwareSource.GitCommit:
          const commitResult = await firmwareDownload.checkoutTag(
            Config.git.url,
            req.firmware.gitTag
          );
          firmwarePath = commitResult.path;
          break;
        case FirmwareSource.Local:
          firmwarePath = req.firmware.localPath;
          break;
        default:
          throw new Error(
            `unsupported firmware source: ${req.firmware.source}`
          );
      }

      updateProgress({
        jobType: req.type,
        type: BuildFirmWareProgressNotificationType.Info,
        step: BuildFirmwareStep.BUILDING_USER_DEFINES,
      });
      const userDefinesBuilder = new UserDefinesTxtBuilder();
      let userDefines = '';
      switch (req.userDefinesMode) {
        case UserDefinesMode.Manual:
          userDefines = req.userDefinesTxt;
          break;
        case UserDefinesMode.UserInterface:
          userDefines = userDefinesBuilder.build(req.userDefines);
          break;
        default:
          throw new Error(
            `unsupported user defines mode: ${req.userDefinesMode}`
          );
      }

      updateProgress({
        jobType: req.type,
        type: BuildFirmWareProgressNotificationType.Info,
        step: BuildFirmwareStep.BUILDING_FIRMWARE,
      });
      const compileResult = await this.builder.build(
        req.target,
        userDefines,
        firmwarePath,
        sendLogs
      );
      if (!compileResult.success) {
        sendResponse({
          success: false,
          errorType: BuildFirmwareErrorType.BuildError,
          message: compileResult.stderr,
        });
        return;
      }

      if (req.type === JobType.Build && compileResult.success) {
        shell.showItemInFolder(
          this.builder.getFirmwareBinPath(req.target, firmwarePath)
        );
      }

      if (req.type === JobType.Build) {
        sendResponse({
          success: true,
        });
        return;
      }

      updateProgress({
        jobType: req.type,
        type: BuildFirmWareProgressNotificationType.Info,
        step: BuildFirmwareStep.FLASHING_FIRMWARE,
      });
      const flashResult = await this.builder.flash(
        req.target,
        firmwarePath,
        sendLogs
      );
      if (!flashResult.success) {
        sendResponse({
          success: false,
          errorType: BuildFirmwareErrorType.FlashError,
          message: flashResult.stderr,
        });
        return;
      }

      sendResponse({
        success: true,
      });
    } catch (e) {
      sendResponse({
        success: false,
        errorType: BuildFirmwareErrorType.GenericError,
        message: `Error: ${e}`,
      });
    }
  }
}
