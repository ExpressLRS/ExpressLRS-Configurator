import { ArgsType, Field } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';
import GitRepository from '../inputs/GitRepositoryInput';

@ArgsType()
export default class TargetDeviceOptionsArgs {
  @Field()
  target: string;

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

  @Field(() => GitRepository)
  gitRepository: GitRepository;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.target = 'DIY_2400_TX_ESP32_SX1280_E28_via_UART';
    this.gitTag = '';
    this.gitBranch = '';
    this.gitCommit = '';
    this.localPath = '';
    this.gitPullRequest = null;
    this.gitRepository = {
      url: '',
      owner: '',
      repositoryName: '',
      rawRepoUrl: '',
      srcFolder: '',
    };
  }
}
