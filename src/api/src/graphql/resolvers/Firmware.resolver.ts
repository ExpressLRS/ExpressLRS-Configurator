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
import BuildFlashFirmwareResult from '../objects/BuildFlashFirmwareResult';
import BuildProgressNotification from '../../models/BuildProgressNotification';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildLogUpdate from '../../models/BuildLogUpdate';
import ClearPlatformioCoreDirResult from '../objects/ClearPlatformioCoreDirResult';
import TargetDeviceOptionsArgs from '../args/TargetDeviceOptions';
import ClearFirmwareFilesResult from '../objects/ClearFirmwareFilesResult';
import TargetArgs from '../args/Target';
import Device from '../../models/Device';
import GitRepository from '../inputs/GitRepositoryInput';
import FlashingStrategyLocatorService from '../../services/FlashingStrategyLocator';
import { BuildProgressNotificationPayload } from '../../services/FlashingStrategyLocator/BuildProgressNotificationPayload';
import { BuildLogUpdatePayload } from '../../services/FlashingStrategyLocator/BuildLogUpdatePayload';
import Platformio from '../../library/Platformio';
import BuildUserDefinesTxtInput from '../inputs/BuildUserDefinesTxtInput';
import BuildUserDefinesTxtResult from '../objects/BuilduserDefinesTxtResult';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';

@Service()
@Resolver()
export default class FirmwareResolver {
  constructor(
    private flashingStrategyLocatorService: FlashingStrategyLocatorService,
    private platformio: Platformio
  ) {}

  @Query(() => [Device])
  async availableFirmwareTargets(
    @Args(() => TargetArgs) args: TargetArgs,
    @Arg('gitRepository', () => GitRepository) gitRepository: GitRepository
  ): Promise<Device[]> {
    const strategy = await this.flashingStrategyLocatorService.locate(
      args,
      gitRepository
    );
    return strategy.availableFirmwareTargets(args, gitRepository);
  }

  @Query(() => [UserDefine])
  async targetDeviceOptions(
    @Args(() => TargetDeviceOptionsArgs) args: TargetDeviceOptionsArgs,
    @Arg('gitRepository', () => GitRepository) gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    const strategy = await this.flashingStrategyLocatorService.locate(
      args,
      gitRepository
    );
    return strategy.targetDeviceOptions(args, gitRepository);
  }

  @Mutation(() => BuildFlashFirmwareResult)
  async buildFlashFirmware(
    @Arg('input', () => BuildFlashFirmwareInput) input: BuildFlashFirmwareInput,
    @Arg('gitRepository', () => GitRepository) gitRepository: GitRepository
  ): Promise<BuildFlashFirmwareResult> {
    const strategy = await this.flashingStrategyLocatorService.locate(
      input.firmware,
      gitRepository
    );
    return strategy.buildFlashFirmware(input, gitRepository);
  }

  @Mutation(() => BuildUserDefinesTxtResult)
  async buildUserDefinesTxt(
    @Arg('input', () => BuildUserDefinesTxtInput)
    input: BuildUserDefinesTxtInput
  ): Promise<BuildUserDefinesTxtResult> {
    const userDefinesTxt = new UserDefinesTxtFactory().build(input.userDefines);
    return new BuildUserDefinesTxtResult(userDefinesTxt);
  }

  @Mutation(() => ClearPlatformioCoreDirResult)
  async clearPlatformioCoreDir(): Promise<ClearPlatformioCoreDirResult> {
    try {
      await this.platformio.clearPlatformioCoreDir();
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
      await this.flashingStrategyLocatorService.clearFirmwareFiles();
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
