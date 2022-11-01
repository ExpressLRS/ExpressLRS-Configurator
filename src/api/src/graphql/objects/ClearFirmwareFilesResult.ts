import { Field, ObjectType } from 'type-graphql';

@ObjectType('ClearFirmwareFilesResult')
export default class ClearFirmwareFilesResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
