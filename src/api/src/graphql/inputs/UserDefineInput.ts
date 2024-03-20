import { Field, InputType } from 'type-graphql';
import UserDefineKind from '../../models/enum/UserDefineKind';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

@InputType('UserDefineInput')
export default class UserDefineInput {
  @Field(() => UserDefineKind)
  type: UserDefineKind;

  @Field(() => UserDefineKey)
  key: UserDefineKey;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => [String], { nullable: true })
  enumValues?: string[];

  @Field(() => String, { nullable: true })
  value?: string;

  constructor() {
    this.type = UserDefineKind.Boolean;
    this.key = UserDefineKey.AUTO_WIFI_ON_INTERVAL;
    this.enabled = false;
  }
}
