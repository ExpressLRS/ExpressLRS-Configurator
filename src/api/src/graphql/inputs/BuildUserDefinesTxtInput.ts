import { Field, InputType } from 'type-graphql';
import UserDefineInput from './UserDefineInput';

@InputType('BuildUserDefinesTxtInput')
export default class BuildUserDefinesTxtInput {
  @Field(() => [UserDefineInput])
  userDefines: UserDefineInput[];

  constructor() {
    this.userDefines = [];
  }
}
