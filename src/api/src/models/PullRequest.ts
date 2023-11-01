import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('PullRequestInput')
@ObjectType('PullRequestType')
export default class PullRequest {
  @Field(() => String)
  title: string;

  @Field(() => Number)
  id: number;

  @Field(() => Number)
  number: number;

  @Field(() => String)
  headCommitHash: string;

  constructor(
    title: string,
    id: number,
    number: number,
    headCommitHash: string
  ) {
    this.title = title;
    this.id = id;
    this.number = number;
    this.headCommitHash = headCommitHash;
  }
}
