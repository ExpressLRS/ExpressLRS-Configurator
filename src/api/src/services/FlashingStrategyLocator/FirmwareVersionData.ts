import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';

export interface FirmwareVersionData {
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}
