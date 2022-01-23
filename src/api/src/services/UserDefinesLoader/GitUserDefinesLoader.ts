import { Service } from 'typedi';
import path from 'path';
import fs from 'fs';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import { LoggerService } from '../../logger';
import extractCompatibleKeys from './extractCompatibleKeys';
import UserDefinesLoader, { GitRepository, UserDefineFilters } from './index';
import {
  findGitExecutable,
  GitFirmwareDownloader,
} from '../../library/FirmwareDownloader';

@Service()
export default class GitUserDefinesLoader implements UserDefinesLoader {
  constructor(
    private logger: LoggerService,
    private PATH: string,
    private userDefinesStoragePath: string
  ) {}

  async loadUserDefinesTxt(
    userDefineFilters: UserDefineFilters,
    gitRepository: GitRepository
  ): Promise<UserDefineKey[]> {
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

    switch (userDefineFilters.source) {
      case FirmwareSource.GitBranch:
        const branchResult = await firmwareDownload.checkoutBranch(
          gitRepository.url,
          path.join(gitRepository.srcFolder, 'user_defines.txt'),
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
          path.join(gitRepository.srcFolder, 'user_defines.txt'),
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
          path.join(gitRepository.srcFolder, 'user_defines.txt'),
          userDefineFilters.gitTag
        );
        const tagData = await fs.promises.readFile(tagResult.path, 'utf8');
        return extractCompatibleKeys(tagData);
      case FirmwareSource.Local:
        const userDefinesPath = path.join(
          userDefineFilters.localPath,
          'user_defines.txt'
        );
        const data = await fs.promises.readFile(userDefinesPath, 'utf8');
        return extractCompatibleKeys(data);
      case FirmwareSource.GitPullRequest:
        const prResult = await firmwareDownload.checkoutCommit(
          gitRepository.url,
          path.join(gitRepository.srcFolder, 'user_defines.txt'),
          userDefineFilters.gitCommit
        );
        const prData = await fs.promises.readFile(prResult.path, 'utf8');
        return extractCompatibleKeys(prData);
      default:
        throw new Error(
          `unsupported firmware source: ${userDefineFilters.source}`
        );
    }
  }
}
