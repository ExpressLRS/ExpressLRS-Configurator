import { Field, ObjectType } from 'type-graphql';

@ObjectType('BuildUserDefinesTxtResult')
export default class BuildUserDefinesTxtResult {
  @Field(() => String, { nullable: true })
  userDefinesTxt: string;

  constructor(userDefinesTxt: string) {
    this.userDefinesTxt = userDefinesTxt;
  }
}
