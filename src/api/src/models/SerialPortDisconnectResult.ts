import { Field, ObjectType } from 'type-graphql';

@ObjectType('SerialPortDisconnectResult')
export default class SerialPortDisconnectResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
