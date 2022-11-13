import { Service } from 'typedi';
import FirmwareSource from '../../models/enum/FirmwareSource';
import UserDefine from '../../models/UserDefine';
import PullRequest from '../../models/PullRequest';
import UserDefinesLoader from '../UserDefinesLoader';
import DeviceService from '../Device';

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
    private userDefinesLoader: UserDefinesLoader,
    private deviceService: DeviceService
  ) {}

  async loadForDevice(
    input: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefine[]> {
    const device = this.deviceService.getDevices().find((item) => {
      return item.targets.find((t) => t.name === input.target);
    });

    const userDefines = device?.userDefines || [];

    if (device === undefined) {
      throw new Error(`device not found for target ${input.target}`);
    }

    if (input.source === FirmwareSource.Local) {
      return userDefines;
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
    return userDefines.filter((userDefine) => {
      return compatibleKeys.indexOf(userDefine.key) > -1;
    });
  }
}
