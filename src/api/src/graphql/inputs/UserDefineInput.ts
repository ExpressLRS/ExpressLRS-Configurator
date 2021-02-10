import { Field, InputType } from 'type-graphql';
import UserDefineKind from '../../models/enum/UserDefineKind';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

@InputType()
export default class UserDefineInput {
  @Field(() => UserDefineKind)
  type: UserDefineKind;

  @Field(() => UserDefineKey)
  key: UserDefineKey;

  @Field()
  enabled: boolean;

  @Field(() => [String], { nullable: true })
  enumValues?: string[];

  @Field({ nullable: true })
  value?: string;

  constructor() {
    this.type = UserDefineKind.Boolean;
    this.key = UserDefineKey.FEATURE_OPENTX_SYNC;
    this.enabled = false;
  }
}
