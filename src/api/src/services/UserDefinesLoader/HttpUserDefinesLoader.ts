import fetch from 'node-fetch';
import { Service } from 'typedi';
import path from 'path';
import fs from 'fs';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import { LoggerService } from '../../logger';
import extractCompatibleKeys from './extractCompatibleKeys';
import UserDefinesLoader, { GitRepository, UserDefineFilters } from './index';

@Service()
export default class HttpUserDefinesLoader implements UserDefinesLoader {
  constructor(private logger: LoggerService) {}

  async loadUserDefinesTxt(
    userDefineFilters: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefineKey[]> {
    this.logger?.log('http based loadUserDefinesTxt', {
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
          `${gitRepository.rawRepoUrl}/${userDefineFilters.gitBranch}${gitRepository.srcFolder}/user_defines.txt`
        )
          .then(handleResponse)
          .then(extractCompatibleKeys);
      case FirmwareSource.GitCommit:
        return fetch(
          `${gitRepository.rawRepoUrl}/${userDefineFilters.gitCommit}${gitRepository.srcFolder}/user_defines.txt`
        )
          .then(handleResponse)
          .then(extractCompatibleKeys);
      case FirmwareSource.GitTag:
        return fetch(
          `${gitRepository.rawRepoUrl}/${userDefineFilters.gitTag}${gitRepository.srcFolder}/user_defines.txt`
        )
          .then(handleResponse)
          .then(extractCompatibleKeys);
      case FirmwareSource.Local:
        const userDefinesPath = path.join(
          userDefineFilters.localPath,
          'user_defines.txt'
        );
        const data = await fs.promises.readFile(userDefinesPath, 'utf8');
        return extractCompatibleKeys(data);
      case FirmwareSource.GitPullRequest:
        return fetch(
          `${gitRepository.rawRepoUrl}/${userDefineFilters.gitPullRequest?.headCommitHash}${gitRepository.srcFolder}/user_defines.txt`
        )
          .then(handleResponse)
          .then(extractCompatibleKeys);
      default:
        throw new Error(
          `unsupported firmware source: ${userDefineFilters.source}`
        );
    }
  }
}
