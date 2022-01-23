import { Service } from 'typedi';
import FirmwareSource from '../../models/enum/FirmwareSource';
import UserDefine from '../../models/UserDefine';
import TargetUserDefinesFactory from '../../factories/TargetUserDefinesFactory';
import PullRequest from '../../models/PullRequest';
import UserDefinesLoader from '../UserDefinesLoader';

interface UserDefineFilters {
  target: string;
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}

interface GitRepository {
  url: string;
  rawRepoUrl: string;
  srcFolder: string;
}

@Service()
export default class UserDefinesBuilder {
  constructor(
    private targetUserDefinesFactory: TargetUserDefinesFactory,
    private userDefinesLoader: UserDefinesLoader
  ) {}

  async build(
    input: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    const availableKeys = this.targetUserDefinesFactory.build(input.target);
    if (input.source === FirmwareSource.Local) {
      return availableKeys;
    }
    const compatibleKeys = await this.userDefinesLoader.loadUserDefinesTxt(
      input,
      gitRepository
    );
    if (compatibleKeys.length < 3) {
      throw new Error(
        `failed to parse compatible user define keys, list is too small: ${compatibleKeys}`
      );
    }
    return availableKeys.filter((userDefine) => {
      return compatibleKeys.indexOf(userDefine.key) > -1;
    });
  }
}
