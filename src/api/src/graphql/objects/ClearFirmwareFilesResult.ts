import { Field, ObjectType } from 'type-graphql';

@ObjectType('ClearFirmwareFilesResult')
export default class ClearFirmwareFilesResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
