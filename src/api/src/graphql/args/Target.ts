import { ArgsType, Field } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';

@ArgsType()
export default class TargetArgs {
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

  @Field(() => PullRequest)
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
