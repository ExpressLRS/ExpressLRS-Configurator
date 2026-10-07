import { Service } from 'typedi';
import { type PubSub } from 'type-graphql';
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
import BuildFirmwareSubstep from '../../models/enum/BuildFirmwareSubstep';
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
import ReceiverConfigurationService, {
  RX_CONFIG_VERSION,
} from '../ReceiverConfiguration';
import { generateUid } from '../ReceiverConfiguration/bindingPhrase';
import {
  parseReceiverCapabilities,
  parseReceiverHardware,
} from '../ReceiverConfiguration/receiverHardware';
import ReceiverCapabilities from '../../graphql/objects/ReceiverCapabilities';
import BuildFlashFirmwareResult from '../../graphql/objects/BuildFlashFirmwareResult';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import DeviceDescriptionsLoader from './DeviceDescriptionsLoader';
import { FirmwareVersionData } from '../FlashingStrategyLocator/FirmwareVersionData';
import Platformio from '../../library/Platformio';
import FirmwareBuilder from '../../library/FirmwareBuilder';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';
import BinaryConfigurator from './BinaryConfigurator';
import {
  maskBuildFlashFirmwareParams,
  maskSensitiveData,
} from '../FlashingStrategyLocator/masks';
import CloudBinariesCache from './CloudBinariesCache';
import { DeviceDescription } from './TargetsJSONLoader';
import FlashOutputParserService, {
  FlashOutputParser,
} from '../FlashOutputParser';

@Service()
export default class BinaryFlashingStrategyService implements FlashingStrategy {
  readonly name: string = 'BinaryFlashingStrategy';

  private mutex: Mutex;

  constructor(
    private PATH: string,
    private firmwaresPath: string,
    private pubSub: PubSub,
    private binaryConfigurator: BinaryConfigurator,
    private platformio: Platformio,
    private builder: FirmwareBuilder,
    private deviceDescriptionsLoader: DeviceDescriptionsLoader,
    private cloudBinariesCache: CloudBinariesCache,
    private targetStorageGitPath: string,
    private logger: LoggerService,
    private flashOutputParserService: FlashOutputParserService,
    private receiverConfiguration: ReceiverConfigurationService,
  ) {
    this.mutex = new Mutex();
  }

  private async updateProgress(
    type: BuildProgressNotificationType,
    step: BuildFirmwareStep,
    substep?: BuildFirmwareSubstep,
    progress?: number,
  ): Promise<void> {
    this.logger?.log('build progress notification', {
      type,
      step,
      substep,
      progress,
    });
    return this.pubSub!.publish(PubSubTopic.BuildProgressNotification, {
      type,
      step,
      substep,
      progress,
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
    gitRepository: GitRepository,
  ): Promise<Device[]> {
    return this.deviceDescriptionsLoader.loadTargetsList(args, gitRepository);
  }

  async targetDeviceOptions(
    args: UserDefineFilters,
    gitRepository: GitRepository,
  ): Promise<UserDefine[]> {
    return this.deviceDescriptionsLoader.targetDeviceOptions(
      args,
      gitRepository,
    );
  }

  private osUsernameContainsAmpersand(): boolean {
    if (
      os.platform() === 'win32'
      && os.userInfo({ encoding: 'utf8' }).username.indexOf('&') > -1
    ) {
      return true;
    }
    return false;
  }

  async isCompatible(params: IsCompatibleArgs, gitRepository: GitRepository) {
    if (
      gitRepository.url.toLowerCase()
      === 'https://github.com/expresslrs/backpack'.toLowerCase()
      && params.source === FirmwareSource.GitTag
      && semver.lte(params.gitTag, '1.3.0')
    ) {
      return false;
    }

    if (
      gitRepository.url.toLowerCase()
      === 'https://github.com/expresslrs/expresslrs'.toLowerCase()
      && params.source === FirmwareSource.GitTag
      && semver.lt(params.gitTag, '3.0.0')
    ) {
      return false;
    }

    return true;
  }

  async downloadSource(
    firmware: FirmwareVersionData,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string,
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
      this.logger,
    );

    let firmwarePath = '';
    switch (firmware.source) {
      case FirmwareSource.GitTag:
        const tagResult = await firmwareDownload.checkoutTag(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitTag,
        );
        firmwarePath = tagResult.path;
        break;
      case FirmwareSource.GitBranch:
        const branchResult = await firmwareDownload.checkoutBranch(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitBranch,
        );
        firmwarePath = branchResult.path;
        break;
      case FirmwareSource.GitCommit:
        const commitResult = await firmwareDownload.checkoutCommit(
          gitRepositoryUrl,
          gitRepositorySrcFolder,
          firmware.gitCommit,
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
            firmware.gitPullRequest.headCommitHash,
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
      this.logger,
    );

    return firmwareDownload.currentCommitHash(gitRepositoryUrl);
  }

  isRequestCompatibleWithCache(params: BuildFlashFirmwareParams): boolean {
    if (params.firmware.source === FirmwareSource.Local) {
      return false;
    }

    return true;
  }

  async compileBinary(
    target: string,
    firmwareSourcePath: string,
    userDefines: UserDefine[],
    parser?: FlashOutputParser,
  ): Promise<string> {
    const onOutput = (output: string) => {
      this.updateLogs(output);
      parser?.(output);
    };
    const pythonCheck = await this.platformio.checkPython();
    if (!pythonCheck.success) {
      this.logger?.error('python dependency check error', undefined, {
        stderr: pythonCheck.stderr,
        stdout: pythonCheck.stdout,
      });
      throw new Error(
        `Python dependency error: ${pythonCheck.stderr} ${pythonCheck.stdout}`,
      );
    }

    const coreCheck = await this.platformio.checkCore();
    if (!coreCheck.success) {
      await this.updateLogs(
        'Failed to find Platformio on your computer. Trying to install it automatically...',
      );
      this.logger?.error('platformio dependency check error', undefined, {
        stderr: coreCheck.stderr,
        stdout: coreCheck.stdout,
      });
      const platformioInstallResult = await this.platformio.install(onOutput);
      if (!platformioInstallResult.success) {
        this.logger?.error('platformio installation error', undefined, {
          stderr: platformioInstallResult.stderr,
          stdout: platformioInstallResult.stdout,
        });
        throw new Error(
          `platformio error: ${platformioInstallResult.stderr} ${platformioInstallResult.stdout}`,
        );
      }
    }

    const buildUserDefines = new UserDefinesTxtFactory().build(userDefines);
    const platformioStateJson = await this.platformio.getPlatformioState();
    this.logger?.log('platformio state json', {
      platformioStateJson,
    });

    await this.updateProgress(
      BuildProgressNotificationType.Info,
      BuildFirmwareStep.BUILDING_FIRMWARE,
    );
    const compileResult = await this.builder.build(
      target,
      buildUserDefines,
      firmwareSourcePath,
      onOutput,
    );
    if (!compileResult.success) {
      this.logger?.error('compile error', undefined, {
        code: compileResult.code,
        stderr: compileResult.stderr,
        stdout: compileResult.stdout,
      });
      await this.updateProgress(
        BuildProgressNotificationType.Error,
        BuildFirmwareStep.BUILDING_FIRMWARE,
      );
      throw new Error(`failed to compile firmware: ${compileResult.stderr}`);
    }

    return this.builder.getFirmwareBinPath(target, firmwareSourcePath);
  }

  async getCachedBuildPath(
    platformioTarget: string,
    userDefines: UserDefine[],
  ): Promise<string> {
    if (platformioTarget.includes('Backpack')) {
      return `${platformioTarget}/firmware.bin`;
    }

    let regulatoryDomain: 'LBT' | 'FCC' = 'FCC';
    const regDomainCE2400 = userDefines.find(
      ({ key }) => key === UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
    );
    if (regDomainCE2400?.enabled) {
      regulatoryDomain = 'LBT';
    }
    return `${regulatoryDomain}/${platformioTarget}/firmware.bin`;
  }

  getCompileTarget(
    config: DeviceDescription,
    userDefines: UserDefine[],
  ): string {
    const rxAsTx
      = userDefines.find((item) => {
        return item.key === UserDefineKey.RX_AS_TX && item.enabled;
      }) !== undefined;
    const firmwareName = rxAsTx
      ? config.firmware.replace('_RX', '_TX')
      : config.firmware;

    let target = `${firmwareName}_via_UART`;

    if (config.upload_methods.includes('stlink')) {
      target = `${config.firmware}_via_STLINK`;
    }
    return target;
  }

  getFirmwareBinFiles(firmwareSearchPath: string): string[] {
    const binaryExtensions = ['.elrs', '.bin', '.gz'];

    const firmwareBinFiles = fs
      .readdirSync(firmwareSearchPath)
      .filter((filename) => binaryExtensions.includes(path.extname(filename)));

    return firmwareBinFiles.map((filename) =>
      path.join(firmwareSearchPath, filename),
    );
  }

  searchFirmwareBinPath(firmwareSearchPath: string): string {
    const firmwareBinFiles = this.getFirmwareBinFiles(firmwareSearchPath);
    const searchValues = [
      'firmware.elrs',
      'firmware.bin.gz',
      'firmware.bin',
      'backpack.bin.gz',
      'backpack.bin',
    ];
    const matchedFilenameFile = searchValues.find((searchFile) => {
      return (
        firmwareBinFiles.find(
          (firmwareBinPath) => searchFile === path.basename(firmwareBinPath),
        ) !== undefined
      );
    });
    if (matchedFilenameFile !== undefined) {
      return path.join(firmwareSearchPath, matchedFilenameFile);
    }

    throw new Error('failed to find firmware binary path');
  }

  async createWorkingDirectory(target: string): Promise<string> {
    return fs.promises.mkdtemp(path.join(os.tmpdir(), `${target}_`));
  }

  async copyFirmwareArtifacts(sourceDir: string, target: string) {
    const firmwareBinFiles = this.getFirmwareBinFiles(sourceDir);
    const jobs = firmwareBinFiles.map((artifact) => {
      return fs.promises.copyFile(
        artifact,
        path.join(target, path.basename(artifact)),
      );
    });
    await Promise.all(jobs);
  }

  /**
   * The configuration is appended to the partition table image, which esptool
   * writes in the same call as the firmware. Flashing methods that only write
   * the application partition cannot carry it.
   */
  private canWriteReceiverConfiguration(
    params: BuildFlashFirmwareParams,
    config: DeviceDescription,
  ): boolean {
    if (params.type !== BuildJobType.Flash) {
      return false;
    }
    if (!params.receiverConfiguration?.enabled) {
      return false;
    }
    // a transmitter stores a tx_config, never write an rx_config onto it
    if (!config.platform.startsWith('esp32') || config.firmware.includes('_TX')) {
      return false;
    }
    // flashed as a transmitter it will not be a receiver either; passing a
    // positional file would also keep the flasher from swapping in the TX image
    const rxAsTx = params.userDefines.find(
      (userDefine) => userDefine.key === UserDefineKey.RX_AS_TX && userDefine.enabled,
    ) !== undefined;
    if (rxAsTx) {
      return false;
    }
    const [, , , uploadMethod] = params.target.split('.');
    return uploadMethod === 'uart' || uploadMethod === 'etx';
  }

  /**
   * Whether the firmware that is about to be flashed stores its configuration
   * the way this service writes it. The version is read from the source tree
   * of that firmware, so flashing an older release, an older commit or a
   * future layout skips the configuration instead of having the firmware
   * discard it on the first boot. ExpressLRS 4.0 is the first release with
   * layout version RX_CONFIG_VERSION.
   */
  private async firmwareConfigLayoutVersion(
    firmwareSourcePath: string,
  ): Promise<number | null> {
    try {
      const configHeader = await fs.promises.readFile(
        path.join(firmwareSourcePath, 'lib', 'CONFIG', 'config.h'),
        'utf8',
      );
      const version = configHeader.match(
        /#define[ \t]+RX_CONFIG_VERSION[ \t]+([0-9]+)/,
      );
      return version === null ? null : Number(version[1]);
    } catch (e) {
      this.logger?.log('could not read the config version of the firmware', {
        firmwareSourcePath,
        err: e,
      });
      return null;
    }
  }

  /** exactly the phrase the flasher receives through --phrase, or nothing */
  private bindingPhraseOf(params: BuildFlashFirmwareParams): string | undefined {
    return params.userDefines.find(
      (userDefine) =>
        userDefine.key === UserDefineKey.BINDING_PHRASE && userDefine.enabled,
    )?.value ?? undefined;
  }

  async buildFlashFirmware(
    params: BuildFlashFirmwareParams,
    gitRepository: GitRepository,
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
        BuildFirmwareErrorType.GenericError,
      );
    }
    this.mutex.tryLock();

    const flashOutputParser = this.flashOutputParserService.create(
      (type, step, substep, progress) => {
        this.updateProgress(type, step, substep, progress);
      },
      { flashingMethod: params.flashingMethod, jobType: params.type },
    );

    try {
      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.VERIFYING_BUILD_SYSTEM,
      );

      const badUsername = this.osUsernameContainsAmpersand();
      if (badUsername) {
        return new BuildFlashFirmwareResult(
          false,
          'Windows username contains & ampersand character. At this time it is not supported and build process will fail. Please change the Windows username.',
          BuildFirmwareErrorType.GenericError,
        );
      }

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.DOWNLOADING_FIRMWARE,
      );
      const firmwareSourcePath = await this.downloadSource(
        params.firmware,
        gitRepositoryUrl,
        gitRepositorySrcFolder,
      );

      const config = await this.deviceDescriptionsLoader.getDeviceConfig(
        {
          ...params.firmware,
          target: params.target,
        },
        {
          url: gitRepositoryUrl,
          srcFolder: gitRepositorySrcFolder,
          hardwareArtifactUrl: gitRepository.hardwareArtifactUrl,
        },
      );

      let sourceFirmwareBinPath = '';
      let firmwareArtifactsDirPath = '';
      const workingDirectory = await this.createWorkingDirectory(params.target);
      const outputDirectory = await this.createWorkingDirectory(params.target);
      let firmwareBinFile = '';
      let firmwareDescriptionsPath = firmwareSourcePath;
      let flasherPath = path.join(
        firmwareSourcePath,
        'python',
        'binary_configurator.py',
      );

      if (this.isRequestCompatibleWithCache(params)) {
        const currentCommitHash = await this.getCurrentSourceCommit(
          gitRepositoryUrl,
        );
        this.logger.log('firmware build request is compatible with cache', {
          currentCommitHash,
        });
        try {
          const cacheLocation = await this.cloudBinariesCache.download(
            gitRepository.repositoryName,
            currentCommitHash,
          );
          const cachedBinaryPath = await this.getCachedBuildPath(
            config.firmware,
            params.userDefines,
          );
          sourceFirmwareBinPath = path.join(cacheLocation, cachedBinaryPath);

          const flasherPyzPath = path.join(cacheLocation, 'flasher.pyz');
          if (fs.existsSync(flasherPyzPath)) {
            flasherPath = flasherPyzPath;
          }
          firmwareDescriptionsPath = cacheLocation;
          this.logger.log('paths', {
            cacheLocation,
            cachedBinaryPath,
            flasherPyzPath,
            sourceFirmwareBinaryPath: sourceFirmwareBinPath,
            hardwareDescriptionsPath: firmwareDescriptionsPath,
          });
        } catch (e) {
          this.logger.log(
            'failed to get cached build, reverting to building firmware locally',
            {
              e,
              currentCommitHash,
            },
          );
        }
      }

      // we were not able to find cloud binaries, so we will build them on the spot
      if (firmwareDescriptionsPath === firmwareSourcePath) {
        const target = this.getCompileTarget(config, params.userDefines);
        sourceFirmwareBinPath = await this.compileBinary(
          target,
          firmwareSourcePath,
          params.userDefines,
          flashOutputParser,
        );
        // In some cases we need to copy multiple artifacts, for example hdzero goggles contains
        // boot_app0.bin, bootloader.bin, firmware.bin, partitions.bin files
        firmwareArtifactsDirPath = path.dirname(sourceFirmwareBinPath);
        await this.copyFirmwareArtifacts(
          firmwareArtifactsDirPath,
          workingDirectory,
        );
        firmwareBinFile = path.join(workingDirectory, 'firmware.bin');
      }
      this.logger.log('firmware binaries path', {
        firmwareBinaryPath: sourceFirmwareBinPath,
      });

      await this.updateProgress(
        BuildProgressNotificationType.Info,
        BuildFirmwareStep.BUILDING_FIRMWARE,
      );

      let flashDiscriminator: number | undefined;
      const configurationRequested = params.receiverConfiguration?.enabled
        === true;
      const configurationPossible = this.canWriteReceiverConfiguration(
        params,
        config,
      );
      const configLayoutVersion = configurationPossible
        ? await this.firmwareConfigLayoutVersion(firmwareSourcePath)
        : null;

      if (configurationRequested && !configurationPossible) {
        await this.updateLogs(
          'The receiver configuration is not written for this target or flashing method, flashing the firmware only.',
        );
      } else if (
        configurationPossible
        && configLayoutVersion !== RX_CONFIG_VERSION
      ) {
        await this.updateLogs(
          configLayoutVersion === null
            ? 'Could not read the configuration layout of this firmware, flashing the firmware only.'
            : `This firmware stores its configuration in layout version ${configLayoutVersion}, this version of the configurator writes version ${RX_CONFIG_VERSION} (ExpressLRS 4.0 or newer), flashing the firmware only.`,
        );
      } else if (configurationPossible) {
        // esptool takes the other artifacts from the directory the firmware
        // binary sits in, so they have to be somewhere we may modify
        if (firmwareBinFile === '' && sourceFirmwareBinPath !== '') {
          await this.copyFirmwareArtifacts(
            path.dirname(sourceFirmwareBinPath),
            workingDirectory,
          );
          firmwareBinFile = path.join(workingDirectory, 'firmware.bin');
        }
        // asked of the flasher so a firmware that honors it produces a
        // matching pair right away; the current firmware ignores the flag and
        // rolls its own, in which case the first boot syncs uid and
        // discriminator from the firmware options and keeps everything else
        flashDiscriminator = Math.floor(Math.random() * 0xfffffffe) + 1;
        const bindingPhrase = this.bindingPhraseOf(params);
        // the same source the capabilities shown in the user interface came
        // from, so what was offered and what is written cannot diverge
        const layout = config.layout_file
          ? await this.deviceDescriptionsLoader.getTargetHardwareLayout(
              {
                ...params.firmware,
                target: params.target,
              },
              {
                url: gitRepositoryUrl,
                srcFolder: gitRepositorySrcFolder,
                hardwareArtifactUrl: gitRepository.hardwareArtifactUrl,
              },
            )
          : null;
        const hardware = layout === null || layout === undefined
          ? null
          : parseReceiverHardware(layout, config.platform);
        // without the pin layout the default output modes cannot be derived,
        // better to leave the receiver unconfigured than to guess them
        const applied = hardware !== null
          && (await this.receiverConfiguration.applyToArtifacts(
            path.dirname(firmwareBinFile),
            params.receiverConfiguration ?? {},
            hardware,
            {
              // an empty phrase is still a phrase for the flasher, which
              // hashes it, so the configuration has to carry the same uid
              uid: bindingPhrase !== undefined
                ? generateUid(bindingPhrase)
                : undefined,
              flashDiscriminator,
            },
          ));
        if (applied) {
          await this.updateLogs(
            'Receiver configuration will be written together with the firmware, replacing everything the receiver has stored.',
          );
        } else {
          flashDiscriminator = undefined;
          await this.updateLogs(
            'Receiver configuration could not be prepared for this target, flashing the firmware only.',
          );
        }
      }

      let flasherArgs: string[][];
      if (
        gitRepository.hardwareArtifactUrl
        && !(
          params.firmware.source === FirmwareSource.Local
          && fs.existsSync(path.join(firmwareDescriptionsPath, 'hardware'))
        )
      ) {
        flasherArgs = this.binaryConfigurator.buildBinaryConfigFlags(
          outputDirectory,
          firmwareBinFile,
          this.targetStorageGitPath,
          firmwareDescriptionsPath,
          params,
          flashDiscriminator,
        );
      } else {
        flasherArgs = this.binaryConfigurator.buildBinaryConfigFlags(
          outputDirectory,
          firmwareBinFile,
          null,
          firmwareDescriptionsPath,
          params,
          flashDiscriminator,
        );
      }
      await this.updateLogs(
        `> ${this.binaryConfigurator.formatCommand(flasherPath, flasherArgs)}`,
      );
      const binaryConfiguratorResult = await this.binaryConfigurator.run(
        flasherPath,
        flasherArgs,
        (output) => {
          this.updateLogs(output);
          flashOutputParser(output);
        },
      );
      const finalStep = params.type === BuildJobType.Flash
        ? BuildFirmwareStep.FLASHING_FIRMWARE
        : BuildFirmwareStep.BUILDING_FIRMWARE;
      if (!binaryConfiguratorResult.success) {
        this.logger?.error('compile error', undefined, {
          code: binaryConfiguratorResult.code,
          stderr: binaryConfiguratorResult.stderr,
          stdout: binaryConfiguratorResult.stdout,
        });
        const streamedNothing
          = binaryConfiguratorResult.stdout.length === 0
            && binaryConfiguratorResult.stderr.length === 0;
        if (streamedNothing) {
          await this.updateLogs(
            `Flasher exited with code ${binaryConfiguratorResult.code} without producing any output.`,
          );
        }
        await this.updateProgress(
          BuildProgressNotificationType.Error,
          finalStep,
        );
        return new BuildFlashFirmwareResult(
          false,
          binaryConfiguratorResult.stderr,
          BuildFirmwareErrorType.BuildError,
        );
      }
      await this.updateProgress(
        BuildProgressNotificationType.Success,
        finalStep,
      );

      if (params.type === BuildJobType.Build) {
        let mainArtifactBinary = this.searchFirmwareBinPath(outputDirectory);
        let canonicalBinPath = mainArtifactBinary;
        if (firmwareBinFile !== '') {
          mainArtifactBinary = this.searchFirmwareBinPath(
            path.dirname(firmwareBinFile),
          );
          canonicalBinPath = await createBinaryCopyWithCanonicalName(
            params,
            mainArtifactBinary,
            outputDirectory,
          );
        }
        return new BuildFlashFirmwareResult(
          true,
          undefined,
          undefined,
          canonicalBinPath,
        );
      }

      if (params.type === BuildJobType.Flash) {
        return new BuildFlashFirmwareResult(true, '');
      }

      return new BuildFlashFirmwareResult(
        false,
        `Build Job Type ${params.type} is not currently supported`,
      );
    } catch (e) {
      this.logger?.error('generic error', undefined, {
        err: e,
      });
      const errorStep = params.type === BuildJobType.Flash
        ? BuildFirmwareStep.FLASHING_FIRMWARE
        : BuildFirmwareStep.BUILDING_FIRMWARE;
      await this.updateProgress(
        BuildProgressNotificationType.Error,
        errorStep,
      );
      return new BuildFlashFirmwareResult(
        false,
        `Error: ${e}`,
        BuildFirmwareErrorType.GenericError,
      );
    } finally {
      this.mutex.unlock();
    }
  }

  /**
   * What the selected receiver supports, so the user interface can offer the
   * settings the hardware can actually apply.
   */
  async receiverCapabilities(
    args: UserDefineFilters,
    gitRepository: GitRepository,
  ): Promise<ReceiverCapabilities> {
    try {
      const config = await this.deviceDescriptionsLoader.getDeviceConfig(
        args,
        gitRepository,
      );
      // targets.json carries no device type, a target is a transmitter when
      // its firmware name says so
      const isTransmitter = config.firmware.includes('_TX');
      if (!config.platform.startsWith('esp32') || isTransmitter) {
        return new ReceiverCapabilities(false);
      }
      const layout = await this.deviceDescriptionsLoader.getTargetHardwareLayout(
        args,
        gitRepository,
      );
      if (layout === null) {
        return new ReceiverCapabilities(false);
      }
      const capabilities = parseReceiverCapabilities(layout);
      return new ReceiverCapabilities(
        true,
        capabilities.powerMin,
        capabilities.powerMax,
        capabilities.powerDefault,
        capabilities.hasSerial1,
        capabilities.pwmChannelCount,
        capabilities.dualRadio,
        capabilities.hasAntennaSwitch,
      );
    } catch (e) {
      this.logger?.error('failed to read receiver capabilities', undefined, {
        err: e,
      });
      return new ReceiverCapabilities(false);
    }
  }

  async clearFirmwareFiles(): Promise<void> {
    await this.deviceDescriptionsLoader.clearCache();
    await this.cloudBinariesCache.clearCache();

    this.logger.log('BinaryConfigurator - clearFirmwareFiles', {
      firmwaresPath: this.firmwaresPath,
    });
    await removeDirectoryContents(this.firmwaresPath);
  }
}
