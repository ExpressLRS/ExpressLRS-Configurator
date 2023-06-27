import { Field, ObjectType } from 'type-graphql';
import LogEntry from './LogEntry';

@ObjectType('LogFile')
export default class LogFile {
  @Field(() => [LogEntry], { nullable: true })
  content: LogEntry[];

  constructor(content: LogEntry[]) {
    this.content = content;
  }
}
