import fetch from 'node-fetch';
import { Service } from 'typedi';
import path from 'path';
import fs from 'fs';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import UserDefine from '../../models/UserDefine';
import TargetUserDefinesFactory from '../../factories/TargetUserDefinesFactory';
import { LoggerService } from '../../logger';
import PullRequest from '../../models/PullRequest';

interface UserDefineFilters {
  target: string;
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}

@Service()
export default class UserDefinesBuilder {
  constructor(
    private rawRepoUrl: string,
    private logger: LoggerService,
    private targetUserDefinesFactory: TargetUserDefinesFactory
  ) {}

  extractCompatibleKeys(userDefinesTxt: string): UserDefineKey[] {
    const userDefinesRegexp = /^#*?-(D[A-z0-9-_]*?)(?==|\s|$)/gm;
    const parsedResults = [...userDefinesTxt.matchAll(userDefinesRegexp)];

    return parsedResults
      .map((matchedGroups) => {
        if (matchedGroups.length === 2) {
          return matchedGroups[1] as UserDefineKey;
        }
        return null;
      })
      .filter((item: UserDefineKey | null): item is UserDefineKey => {
        return item != null;
      });
  }

  async loadUserDefinesTxt(
    userDefineFilters: UserDefineFilters
  ): Promise<UserDefineKey[]> {
    this.logger?.log('loadUserDefinesTxt', {
      userDefineFilters,
    });
    const handleResponse = async (response: {
      status: number;
      ok: boolean;
      text: () => Promise<string>;
    }): Promise<string> => {
      const body = await response.text();
      if (!response.ok) {
        this.logger?.log('failed to get user_defines.txt', {
          status: response.status,
          body,
        });
        throw new Error(
          `failed to get user_defines.txt: ${response.status}, ${body}`
        );
      }
      return body;
    };
    switch (userDefineFilters.source) {
      case FirmwareSource.GitBranch:
        return fetch(
          `${this.rawRepoUrl}/${userDefineFilters.gitBranch}/src/user_defines.txt`
        )
          .then(handleResponse)
          .then(this.extractCompatibleKeys);
      case FirmwareSource.GitCommit:
        return fetch(
          `${this.rawRepoUrl}/${userDefineFilters.gitCommit}/src/user_defines.txt`
        )
          .then(handleResponse)
          .then(this.extractCompatibleKeys);
      case FirmwareSource.GitTag:
        return fetch(
          `${this.rawRepoUrl}/${userDefineFilters.gitTag}/src/user_defines.txt`
        )
          .then(handleResponse)
          .then(this.extractCompatibleKeys);
      case FirmwareSource.Local:
        const userDefinesPath = path.join(
          userDefineFilters.localPath,
          'user_defines.txt'
        );
        const data = await fs.promises.readFile(userDefinesPath, 'utf8');
        return this.extractCompatibleKeys(data);
      case FirmwareSource.GitPullRequest:
        return fetch(
          `${this.rawRepoUrl}/${userDefineFilters.gitPullRequest?.headCommitHash}/src/user_defines.txt`
        )
          .then(handleResponse)
          .then(this.extractCompatibleKeys);
      default:
        throw new Error(
          `unsupported firmware source: ${userDefineFilters.source}`
        );
    }
  }

  async build(input: UserDefineFilters): Promise<UserDefine[]> {
    const availableKeys = this.targetUserDefinesFactory.build(input.target);
    if (input.source === FirmwareSource.Local) {
      return availableKeys;
    }
    const compatibleKeys = await this.loadUserDefinesTxt(input);
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
