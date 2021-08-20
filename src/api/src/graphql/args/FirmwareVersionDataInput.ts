import { ArgsType, Field } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';
import PullRequest from '../../models/PullRequest';

@ArgsType()
export default class TargetDeviceOptionsArgs {
  @Field(() => DeviceTarget)
  target: DeviceTarget;

  @Field(() => FirmwareSource)
  source: FirmwareSource;

  @Field()
  gitTag: string;

  @Field()
  gitBranch: string;

  @Field()
  gitCommit: string;

  @Field()
  localPath: string;

  @Field(() => PullRequest)
  gitPullRequest: PullRequest | null;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.target = DeviceTarget.DIY_2400_TX_ESP32_SX1280_E28_via_UART;
    this.gitTag = '';
    this.gitBranch = '';
    this.gitCommit = '';
    this.localPath = '';
    this.gitPullRequest = null;
  }
}
