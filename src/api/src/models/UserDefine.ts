import { Field, ObjectType } from 'type-graphql';
import UserDefineKind from './enum/UserDefineKind';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';

@ObjectType()
export default class UserDefine {
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

  constructor(
    type: UserDefineKind,
    key: UserDefineKey,
    enabled = false,
    value = '',
    enumValues?: string[]
  ) {
    this.type = type;

    if (type === UserDefineKind.Enum) {
      if (enumValues === undefined || enumValues.length === 0) {
        throw new Error(
          `enum option for ${key} enum values are invalid: ${enumValues}`
        );
      }

      if (enumValues?.indexOf(value) === -1) {
        throw new Error(
          `enum option ${key} value ${value} does not belong to the enum itself: ${enumValues}`
        );
      }
    }

    this.key = key;
    this.enumValues = enumValues;
    this.value = value;
    this.enabled = enabled;
  }

  static Boolean(key: UserDefineKey, enabled = false): UserDefine {
    return new UserDefine(UserDefineKind.Boolean, key, enabled);
  }

  static Text(key: UserDefineKey, value = '', enabled = false): UserDefine {
    return new UserDefine(UserDefineKind.Text, key, enabled, value);
  }

  static Enum(
    key: UserDefineKey,
    enumValues: string[],
    value = '',
    enabled = false
  ): UserDefine {
    return new UserDefine(UserDefineKind.Enum, key, enabled, value, enumValues);
  }
}
