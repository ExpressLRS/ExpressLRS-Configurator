import { Field, InputType } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';

@InputType('FirmwareVersionDataInput')
export default class FirmwareVersionDataInput {
  @Field(() => FirmwareSource)
  source: FirmwareSource;

  @Field()
  gitTag: string;

  @Field()
  gitBranch: string;

  @Field()
  gitCommit: string;

  @Field()
  localPath: string;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.gitTag = '';
    this.gitBranch = '';
    this.gitCommit = '';
    this.localPath = '';
  }
}
