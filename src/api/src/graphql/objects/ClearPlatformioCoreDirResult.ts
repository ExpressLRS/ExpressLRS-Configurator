import { Field, ObjectType } from 'type-graphql';

@ObjectType('ClearPlatformioCoreDirResult')
export default class ClearPlatformioCoreDirResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
