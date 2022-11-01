import { Field, ObjectType } from 'type-graphql';

@ObjectType('ClearPlatformioCoreDirResult')
export default class ClearPlatformioCoreDirResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
