import { Field, ObjectType } from 'type-graphql';
import UserDefineKind from './enum/UserDefineKind';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefineOptionGroup from './enum/UserDefineOptionGroup';

@ObjectType('UserDefine')
export default class UserDefine {
  @Field(() => UserDefineKind)
  type: UserDefineKind;

  @Field(() => UserDefineKey)
  key: UserDefineKey;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => Boolean, { nullable: true })
  sensitive?: boolean;

  @Field(() => [String], { nullable: true })
  enumValues?: string[];

  @Field(() => String, { nullable: true })
  value?: string;

  @Field(() => UserDefineOptionGroup, { nullable: true })
  optionGroup?: UserDefineOptionGroup;

  constructor(
    type: UserDefineKind,
    key: UserDefineKey,
    enabled = false,
    value = '',
    enumValues?: string[],
    optionGroup?: UserDefineOptionGroup,
    sensitive = false
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
    this.optionGroup = optionGroup;
    this.sensitive = sensitive ?? false;
  }

  static Boolean(
    key: UserDefineKey,
    enabled = false,
    userDefineOptionGroup?: UserDefineOptionGroup
  ): UserDefine {
    return new UserDefine(
      UserDefineKind.Boolean,
      key,
      enabled,
      undefined,
      undefined,
      userDefineOptionGroup
    );
  }

  static Text(
    key: UserDefineKey,
    value = '',
    enabled = false,
    sensitive = false
  ): UserDefine {
    return new UserDefine(
      UserDefineKind.Text,
      key,
      enabled,
      value,
      undefined,
      undefined,
      sensitive
    );
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
