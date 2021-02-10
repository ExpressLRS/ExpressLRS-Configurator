import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Inject, Service } from 'typedi';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';
import UserDefine from '../../models/UserDefine';
import TargetUserDefinesFactory from '../../factories/TargetUserDefinesFactory';
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

@Service()
@Resolver()
export default class FirmwareResolver {
  constructor(
    private firmwareService: FirmwareService,
    @Inject(ConfigToken) private config: IConfig
  ) {}

  @Query(() => [DeviceTarget])
  async availableFirmwareTargets(): Promise<DeviceTarget[]> {
    return Object.values(DeviceTarget);
  }

  @Query(() => [UserDefine])
  async targetDeviceOptions(
    @Arg('target') target: DeviceTarget
  ): Promise<UserDefine[]> {
    return new TargetUserDefinesFactory().build(target);
  }

  @Mutation(() => BuildFlashFirmwareResult)
  async buildFlashFirmware(
    @Arg('input') input: BuildFlashFirmwareInput
  ): Promise<BuildFlashFirmwareResult> {
    return this.firmwareService.buildFlashFirmware(input, this.config.git);
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
