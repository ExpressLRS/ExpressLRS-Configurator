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
import FirmwareService, {
  BuildLogUpdatePayload,
  BuildProgressNotificationPayload,
} from '../../services/Firmware';
import BuildProgressNotification from '../../models/BuildProgressNotification';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildLogUpdate from '../../models/BuildLogUpdate';
import ClearPlatformioCoreDirResult from '../objects/ClearPlatformioCoreDirResult';
import TargetDeviceOptionsArgs from '../args/TargetDeviceOptions';
import UserDefinesBuilder from '../../services/UserDefinesBuilder';
import ClearFirmwareFilesResult from '../objects/ClearFirmwareFilesResult';
import TargetsLoader from '../../services/TargetsLoader';
import TargetArgs from '../args/Target';
import Device from '../../models/Device';
import GitRepository from '../inputs/GitRepositoryInput';
import BuildUserDefinesTxtInput from '../inputs/BuildUserDefinesTxtInput';
import BuildUserDefinesTxtResult from '../objects/BuilduserDefinesTxtResult';

@Service()
@Resolver()
export default class FirmwareResolver {
  constructor(
    private firmwareService: FirmwareService,
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
    return this.firmwareService.buildFlashFirmware(
      input,
      gitRepository.url,
      gitRepository.srcFolder
    );
  }

  @Mutation(() => BuildUserDefinesTxtResult)
  async buildUserDefinesTxt(
    @Arg('input') input: BuildUserDefinesTxtInput
  ): Promise<BuildUserDefinesTxtResult> {
    const userDefinesTxt = await this.firmwareService.buildUserDefinesTxt(
      input.userDefines
    );
    return new BuildUserDefinesTxtResult(userDefinesTxt);
  }

  @Mutation(() => ClearPlatformioCoreDirResult)
  async clearPlatformioCoreDir(): Promise<ClearPlatformioCoreDirResult> {
    try {
      await this.firmwareService.clearPlatformioCoreDir();
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
      await this.firmwareService.clearFirmwareFiles();
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
