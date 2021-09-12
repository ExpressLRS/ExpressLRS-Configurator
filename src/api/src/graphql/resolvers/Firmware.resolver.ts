import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Inject, Service } from 'typedi';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';
import UserDefine from '../../models/UserDefine';
import BuildFlashFirmwareInput from '../inputs/BuildFlashFirmwareInput';
import BuildFlashFirmwareResult from '../../models/BuildFlashFirmwareResult';
import FirmwareService, {
  BuildLogUpdatePayload,
  BuildProgressNotificationPayload,
} from '../../services/Firmware';
import BuildProgressNotification from '../../models/BuildProgressNotification';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import BuildLogUpdate from '../../models/BuildLogUpdate';
import { ConfigToken, IConfig } from '../../config';
import ClearPlatformioCoreDirResult from '../../models/ClearPlatformioCoreDirResult';
import TargetDeviceOptionsArgs from '../args/TargetDeviceOptions';
import UserDefinesBuilder from '../../services/UserDefinesBuilder';
import ClearFirmwareFilesResult from '../../models/ClearFirmwareFiles';
import TargetsService from '../../services/Targets';
import TargetArgs from '../args/Target';

@Service()
@Resolver()
export default class FirmwareResolver {
  constructor(
    private firmwareService: FirmwareService,
    private userDefinesBuilder: UserDefinesBuilder,
    private targetsService: TargetsService,
    @Inject(ConfigToken) private config: IConfig
  ) {}

  @Query(() => [DeviceTarget])
  async availableFirmwareTargets(
    @Args() args: TargetArgs
  ): Promise<DeviceTarget[]> {
    return this.targetsService.loadTargetsList(
      this.config.git.owner,
      this.config.git.repositoryName,
      args
    );
  }

  @Query(() => [UserDefine])
  async targetDeviceOptions(
    @Args() args: TargetDeviceOptionsArgs
  ): Promise<UserDefine[]> {
    return this.userDefinesBuilder.build(args);
  }

  @Mutation(() => BuildFlashFirmwareResult)
  async buildFlashFirmware(
    @Arg('input') input: BuildFlashFirmwareInput
  ): Promise<BuildFlashFirmwareResult> {
    return this.firmwareService.buildFlashFirmware(input, this.config.git);
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
