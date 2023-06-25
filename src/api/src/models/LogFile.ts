import { Field, ObjectType } from 'type-graphql';

@ObjectType('LogFile')
export default class LogFile {
  @Field({ nullable: true })
  content: string | null;

  constructor(content: string | null) {
    this.content = content;
  }
}
