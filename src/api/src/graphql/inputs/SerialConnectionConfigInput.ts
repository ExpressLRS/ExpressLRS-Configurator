import { Field, InputType } from 'type-graphql';

@InputType('SerialConnectionConfigInput')
export default class SerialConnectionConfigInput {
  @Field(() => String)
  port: string;

  @Field(() => Number)
  baudRate: number;

  constructor() {
    this.port = '';
    this.baudRate = 420000;
  }
}
