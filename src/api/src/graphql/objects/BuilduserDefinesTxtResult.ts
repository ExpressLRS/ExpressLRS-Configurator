import { Field, ObjectType } from 'type-graphql';

@ObjectType('BuildUserDefinesTxtResult')
export default class BuildUserDefinesTxtResult {
  @Field({ nullable: true })
  userDefinesTxt: string;

  constructor(userDefinesTxt: string) {
    this.userDefinesTxt = userDefinesTxt;
  }
}
