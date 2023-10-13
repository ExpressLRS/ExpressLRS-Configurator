import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';

export interface UserDefineFilters {
  target: string;
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}

export interface GitRepository {
  url: string;
  rawRepoUrl: string;
  srcFolder: string;
}

export default abstract class UserDefinesLoader {
  abstract loadUserDefinesTxt(
    userDefineFilters: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefineKey[]>;

  abstract clearFiles(): void;
}
