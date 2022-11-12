import { Field, ObjectType } from 'type-graphql';

@ObjectType('SerialPortConnectResult')
export default class SerialPortConnectResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  constructor(success: boolean, message?: string) {
    this.success = success;
    this.message = message;
  }
}
