import { Service } from 'typedi';
import FirmwareSource from '../../models/enum/FirmwareSource';
import UserDefine from '../../models/UserDefine';
import PullRequest from '../../models/PullRequest';
import UserDefinesLoader from '../UserDefinesLoader';
import DeviceService from '../Device';
import UserDefinesTxtFactory from '../../factories/UserDefinesTxtFactory';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

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

  async buildUserDefinesTxt(userDefines: UserDefine[]): Promise<string> {
    const userDefinesBuilder = new UserDefinesTxtFactory();
    return userDefinesBuilder.build(this.processUserDefines(userDefines));
  }

  private processUserDefines(userDefines: UserDefine[]): UserDefine[] {
    const overrideUserDefineTo = (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      userDefines: UserDefine[],
      defaultUserDefine: UserDefine
    ): UserDefine[] => {
      const exists =
        userDefines.find(({ key }) => key === defaultUserDefine.key) !==
        undefined;
      if (exists) {
        return userDefines.map((item) => {
          if (item.key === defaultUserDefine.key) {
            return defaultUserDefine;
          }
          return item;
        });
      }
      return [...userDefines, defaultUserDefine];
    };
    const overrides = [
      UserDefine.Boolean(UserDefineKey.FAST_SYNC, true),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_50HZ, false),
    ];
    let result = userDefines;
    overrides.forEach((override) => {
      result = overrideUserDefineTo(result, override);
    });
    return result;
  }

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
