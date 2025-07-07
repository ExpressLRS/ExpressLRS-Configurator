import { Field, InputType } from 'type-graphql';
import BuildJobType from '../../models/enum/BuildJobType';
import FirmwareVersionDataInput from './FirmwareVersionDataInput';
import UserDefineInput from './UserDefineInput';

@InputType('BuildFlashFirmwareInput')
export default class BuildFlashFirmwareInput {
  @Field(() => BuildJobType)
  type: BuildJobType;

  @Field(() => String, { nullable: true })
  serialDevice?: string;

  @Field(() => FirmwareVersionDataInput)
  firmware: FirmwareVersionDataInput;

  @Field(() => String)
  target: string;

  @Field(() => [UserDefineInput])
  userDefines: UserDefineInput[];

  @Field(() => Boolean)
  erase: boolean;

  @Field(() => Boolean)
  forceFlash: boolean;

  constructor() {
    this.type = BuildJobType.Build;
    this.firmware = new FirmwareVersionDataInput();
    this.target = 'DIY_2400_TX_ESP32_SX1280_E28_via_UART';
    this.userDefines = [];
    this.erase = false;
    this.forceFlash = false;
  }
}
