import { Field, ObjectType } from 'type-graphql';
import DeviceType from './enum/DeviceType';
import Target from './Target';
import UserDefine from './UserDefine';

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

  @Field(() => [UserDefine])
  userDefines: UserDefine[];

  @Field({ nullable: true })
  wikiUrl?: string;

  @Field()
  deviceType: DeviceType;

  @Field()
  verifiedHardware: boolean;

  @Field({ nullable: true })
  parent?: string | null;

  @Field({ nullable: true })
  abbreviatedName?: string | null;

  @Field({ nullable: true })
  luaName?: string | null;

  @Field({ nullable: true })
  priorTargetName?: string | null;

  constructor(
    id: string,
    name: string,
    category: string,
    targets: Target[],
    userDefines: UserDefine[],
    deviceType: DeviceType,
    verifiedHardware: boolean,
    wikiUrl?: string,
    parent?: string | null,
    abbreviatedName?: string | null,
    luaName?: string | null,
    priorTargetName?: string | null
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.targets = targets;
    this.userDefines = userDefines;
    this.wikiUrl = wikiUrl;
    this.deviceType = deviceType;
    this.verifiedHardware = verifiedHardware;
    this.parent = parent;
    this.abbreviatedName = abbreviatedName;
    this.luaName = luaName;
    this.priorTargetName = priorTargetName;
  }
}
