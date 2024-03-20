import { Field, InputType } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';

@InputType('FirmwareVersionDataInput')
export default class FirmwareVersionDataInput {
  @Field(() => FirmwareSource)
  source: FirmwareSource;

  @Field(() => String)
  gitTag: string;

  @Field(() => String)
  gitBranch: string;

  @Field(() => String)
  gitCommit: string;

  @Field(() => String)
  localPath: string;

  @Field(() => PullRequest, { nullable: true })
  gitPullRequest: PullRequest | null;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.gitTag = '';
    this.gitBranch = '';
    this.gitCommit = '';
    this.localPath = '';
    this.gitPullRequest = null;
  }
}
