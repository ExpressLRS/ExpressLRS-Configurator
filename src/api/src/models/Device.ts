import { Field, ObjectType } from 'type-graphql';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import DeviceType from './enum/DeviceType';
import Target from './Target';

@ObjectType('Device')
export default class Device {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field(() => [Target])
  targets: Target[];

  @Field(() => [UserDefineKey])
  userDefines: UserDefineKey[];

  @Field({ nullable: true })
  wikiUrl?: string;

  @Field()
  deviceType: DeviceType;

  @Field({ nullable: true })
  parent?: string | null;

  constructor(
    id: string,
    name: string,
    category: string,
    targets: Target[],
    userDefines: UserDefineKey[],
    deviceType: DeviceType,
    wikiUrl?: string,
    parent?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.targets = targets;
    this.userDefines = userDefines;
    this.wikiUrl = wikiUrl;
    this.deviceType = deviceType;
    this.parent = parent;
  }
}
