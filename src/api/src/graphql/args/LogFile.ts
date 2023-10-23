import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export default class LogFileArgs {
  @Field(() => Int)
  numberOfLines: number;

  constructor() {
    this.numberOfLines = 500;
  }
}
