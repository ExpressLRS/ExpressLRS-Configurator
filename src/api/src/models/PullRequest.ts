import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('PullRequestInput')
@ObjectType('PullRequestType')
export default class PullRequest {
  @Field()
  title: string;

  @Field()
  id: number;

  @Field()
  number: number;

  @Field()
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
