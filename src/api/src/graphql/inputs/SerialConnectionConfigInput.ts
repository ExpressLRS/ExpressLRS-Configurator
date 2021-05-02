import { Field, InputType } from 'type-graphql';

@InputType('SerialConnectionConfigInput')
export default class SerialConnectionConfigInput {
  @Field()
  port: string;

  @Field()
  baudRate: number;

  constructor() {
    this.port = '';
    this.baudRate = 420000;
  }
}
