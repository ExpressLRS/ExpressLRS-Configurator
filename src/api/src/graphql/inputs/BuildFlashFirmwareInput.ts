import { Field, InputType } from 'type-graphql';
import BuildJobType from '../../models/enum/BuildJobType';
import FirmwareVersionDataInput from './FirmwareVersionDataInput';
import UserDefinesMode from '../../models/enum/UserDefinesMode';
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

  @Field(() => UserDefinesMode)
  userDefinesMode: UserDefinesMode;

  @Field(() => [UserDefineInput])
  userDefines: UserDefineInput[];

  @Field(() => String)
  userDefinesTxt: string;

  @Field(() => Boolean)
  erase: boolean;

  @Field(() => Boolean)
  forceFlash: boolean;

  constructor() {
    this.type = BuildJobType.Build;
    this.firmware = new FirmwareVersionDataInput();
    this.target = 'DIY_2400_TX_ESP32_SX1280_E28_via_UART';
    this.userDefinesMode = UserDefinesMode.UserInterface;
    this.userDefines = [];
    this.userDefinesTxt = '';
    this.erase = false;
    this.forceFlash = false;
  }
}
