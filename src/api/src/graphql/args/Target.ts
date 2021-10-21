import { ArgsType, Field } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';
import GitRepo from '../inputs/GitRepoInput';

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

  @Field(() => GitRepo)
  gitRepo: GitRepo;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.gitTag = '';
    this.gitBranch = '';
    this.gitCommit = '';
    this.localPath = '';
    this.gitPullRequest = null;
    this.gitRepo = {
      url: '',
      cloneUrl: '',
      owner: '',
      repositoryName: '',
      rawRepoUrl: '',
      srcFolder: '',
    };
  }
}
