import { Field, ObjectType } from 'type-graphql';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
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

  @Field(() => [Target])
  userDefines: UserDefineKey[];

  @Field({ nullable: true })
  wikiUrl?: string;

  constructor(
    id: string,
    name: string,
    category: string,
    targets: Target[],
    userDefines: UserDefineKey[],
    wikiUrl?: string
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.targets = targets;
    this.userDefines = userDefines;
    this.wikiUrl = wikiUrl;
  }
}
