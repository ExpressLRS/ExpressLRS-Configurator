import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Service } from 'typedi';
import UserDefine from '../../models/UserDefine';
import BuildFlashFirmwareInput from '../inputs/BuildFlashFirmwareInput';
import BuildFlashFirmwareResult from '../../models/BuildFlashFirmwareResult';
import BuildProgressNotification from '../../models/BuildProgressNotification';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildLogUpdate from '../../models/BuildLogUpdate';
import ClearPlatformioCoreDirResult from '../../models/ClearPlatformioCoreDirResult';
import TargetDeviceOptionsArgs from '../args/TargetDeviceOptions';
import UserDefinesBuilder from '../../services/UserDefinesBuilder';
import ClearFirmwareFilesResult from '../../models/ClearFirmwareFiles';
import TargetsLoader from '../../services/TargetsLoader';
import TargetArgs from '../args/Target';
import Device from '../../models/Device';
import GitRepository from '../inputs/GitRepositoryInput';
import FlashingStrategyLocatorService from '../../services/FlashingStrategyLocator';
import { BuildProgressNotificationPayload } from '../../services/FlashingStrategyLocator/BuildProgressNotificationPayload';
import { BuildLogUpdatePayload } from '../../services/FlashingStrategyLocator/BuildLogUpdatePayload';
import PlatformioFlashingStrategy from '../../services/PlatformioFlashingStrategy';

@Service()
@Resolver()
export default class FirmwareResolver {
  constructor(
    private platformioFlashingStrategy: PlatformioFlashingStrategy,
    private flashingStrategyLocatorService: FlashingStrategyLocatorService,
    private userDefinesBuilder: UserDefinesBuilder,
    private targetsLoaderService: TargetsLoader
  ) {}

  @Query(() => [Device])
  async availableFirmwareTargets(
    @Args() args: TargetArgs,
    @Arg('gitRepository') gitRepository: GitRepository
  ): Promise<Device[]> {
    return this.targetsLoaderService.loadTargetsList(args, gitRepository);
  }

  @Query(() => [UserDefine])
  async targetDeviceOptions(
    @Args() args: TargetDeviceOptionsArgs,
    @Arg('gitRepository') gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    return this.userDefinesBuilder.build(args, gitRepository);
  }

  @Mutation(() => BuildFlashFirmwareResult)
  async buildFlashFirmware(
    @Arg('input') input: BuildFlashFirmwareInput,
    @Arg('gitRepository') gitRepository: GitRepository
  ): Promise<BuildFlashFirmwareResult> {
    const strategy = await this.flashingStrategyLocatorService.locate(
      input,
      gitRepository.url,
      gitRepository.srcFolder
    );
    return strategy.buildFlashFirmware(
      input,
      gitRepository.url,
      gitRepository.srcFolder
    );
  }

  @Mutation(() => ClearPlatformioCoreDirResult)
  async clearPlatformioCoreDir(): Promise<ClearPlatformioCoreDirResult> {
    try {
      await this.platformioFlashingStrategy.clearPlatformioCoreDir();
      return new ClearPlatformioCoreDirResult(true);
    } catch (e) {
      return new ClearPlatformioCoreDirResult(
        false,
        `Failed to clear platformio state: ${e}`
      );
    }
  }

  @Mutation(() => ClearFirmwareFilesResult)
  async clearFirmwareFiles(): Promise<ClearFirmwareFilesResult> {
    try {
      await this.platformioFlashingStrategy.clearFirmwareFiles();
      return new ClearFirmwareFilesResult(true);
    } catch (e) {
      return new ClearFirmwareFilesResult(
        false,
        `Failed to clear firmware files cache: ${e}`
      );
    }
  }

  @Subscription(() => BuildProgressNotification, {
    topics: [PubSubTopic.BuildProgressNotification],
  })
  buildProgressNotifications(
    @Root() n: BuildProgressNotificationPayload
  ): BuildProgressNotification {
    return new BuildProgressNotification(n.type, n.step, n.message);
  }

  @Subscription(() => BuildLogUpdate, {
    topics: [PubSubTopic.BuildLogsUpdate],
  })
  buildLogUpdates(@Root() u: BuildLogUpdatePayload): BuildLogUpdate {
    return new BuildLogUpdate(u.data);
  }
}
