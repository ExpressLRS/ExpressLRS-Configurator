import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class LogFileArgs {
  @Field()
  numberOfLines: number;

  constructor() {
    this.numberOfLines = 20;
  }
}
