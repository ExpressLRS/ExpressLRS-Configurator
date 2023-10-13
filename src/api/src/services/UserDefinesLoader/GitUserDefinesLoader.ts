import { Service } from 'typedi';
import fs from 'fs';
import path from 'path';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import { LoggerService } from '../../logger';
import extractCompatibleKeys from './extractCompatibleKeys';
import UserDefinesLoader, { GitRepository, UserDefineFilters } from './index';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';
import Mutex from '../../library/Mutex';
import { removeDirectoryContents } from '../FlashingStrategyLocator/artefacts';

@Service()
export default class GitUserDefinesLoader implements UserDefinesLoader {
  mutex: Mutex;

  constructor(
    private logger: LoggerService,
    private PATH: string,
    private userDefinesStoragePath: string
  ) {
    this.mutex = new Mutex();
  }

  async loadUserDefinesTxt(
    userDefineFilters: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefineKey[]> {
    await this.mutex.tryLockWithTimeout(60000);
    try {
      this.logger?.log('git based loadUserDefinesTxt', {
        userDefineFilters,
      });

      let gitPath = '';
      try {
        gitPath = await findGitExecutable(this.PATH);
      } catch (e) {
        this.logger?.error('failed to find git', undefined, {
          PATH: this.PATH,
          err: e,
        });
        throw e;
      }
      this.logger?.log('git path', {
        gitPath,
      });

      const firmwareDownload = new GitFirmwareDownloader(
        {
          baseDirectory: this.userDefinesStoragePath,
          gitBinaryLocation: gitPath,
        },
        this.logger
      );
      const srcFolder =
        gitRepository.srcFolder === '/' ? '' : `${gitRepository.srcFolder}/`;

      switch (userDefineFilters.source) {
        case FirmwareSource.GitBranch:
          const branchResult = await firmwareDownload.checkoutBranch(
            gitRepository.url,
            `${srcFolder}user_defines.txt`,
            userDefineFilters.gitBranch
          );
          const branchData = await fs.promises.readFile(
            branchResult.path,
            'utf8'
          );
          return extractCompatibleKeys(branchData);
        case FirmwareSource.GitCommit:
          const commitResult = await firmwareDownload.checkoutCommit(
            gitRepository.url,
            `${srcFolder}user_defines.txt`,
            userDefineFilters.gitCommit
          );
          const commitData = await fs.promises.readFile(
            commitResult.path,
            'utf8'
          );
          return extractCompatibleKeys(commitData);
        case FirmwareSource.GitTag:
          const tagResult = await firmwareDownload.checkoutTag(
            gitRepository.url,
            `${srcFolder}user_defines.txt`,
            userDefineFilters.gitTag
          );
          const tagData = await fs.promises.readFile(tagResult.path, 'utf8');
          return extractCompatibleKeys(tagData);
        case FirmwareSource.Local:
          const data = await fs.promises.readFile(
            path.join(userDefineFilters.localPath, 'user_defines.txt'),
            'utf8'
          );
          return extractCompatibleKeys(data);
        case FirmwareSource.GitPullRequest:
          if (userDefineFilters.gitPullRequest === null) {
            throw new Error('empty GitPullRequest head commit hash');
          }
          const prResult = await firmwareDownload.checkoutCommit(
            gitRepository.url,
            `${srcFolder}user_defines.txt`,
            userDefineFilters.gitPullRequest.headCommitHash
          );
          const prData = await fs.promises.readFile(prResult.path, 'utf8');
          return extractCompatibleKeys(prData);
        default:
          throw new Error(
            `unsupported firmware source: ${userDefineFilters.source}`
          );
      }
    } finally {
      this.mutex.unlock();
    }
  }

  async clearFiles() {
    await this.mutex.tryLockWithTimeout(60000);
    try {
      await removeDirectoryContents(this.userDefinesStoragePath);
    } finally {
      this.mutex.unlock();
    }
  }
}
