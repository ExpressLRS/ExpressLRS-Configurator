/* eslint-disable no-await-in-loop */
import simpleGit, { ResetMode, SimpleGitOptions } from 'simple-git';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';
import Commander, { CommandResult } from '../Commander';
import { LoggerService } from '../../logger';

interface FirmwareDownloaderProps {
  baseDirectory: string;
  gitBinaryLocation: string;
}

export interface FirmwareResult {
  path: string;
}

export interface IFirmwareDownloader {
  checkoutTag(
    repository: string,
    srcFolder: string,
    tagName: string
  ): Promise<FirmwareResult>;

  checkoutBranch(
    repository: string,
    srcFolder: string,
    branchName: string
  ): Promise<FirmwareResult>;

  checkoutCommit(
    repository: string,
    srcFolder: string,
    commit: string
  ): Promise<FirmwareResult>;
}

export const findGitExecutable = async (envPath: string): Promise<string> => {
  const IS_WINDOWS = process.platform.startsWith('win');
  const exenames = IS_WINDOWS ? ['git.exe', 'git'] : ['git'];

  // eslint-disable-next-line no-restricted-syntax
  for (const location of envPath.split(path.delimiter)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const exename of exenames) {
      const executable = path
        .normalize(path.join(location, exename))
        .replace(/"/g, '');
      try {
        let res: CommandResult | null = null;
        if (
          existsSync(executable) &&
          // eslint-disable-next-line no-cond-assign
          (res = await new Commander().runCommand(executable, ['--version']))
        ) {
          console.log('tested git exec', executable);
          if (res.success) {
            console.log('confirmed git exec', executable);
            return executable;
          }
        }
      } catch (err) {
        console.warn(executable, err);
      }
    }
  }
  throw new Error('git exec not found');
};

export class GitFirmwareDownloader implements IFirmwareDownloader {
  baseDirectory: string;

  gitBinaryLocation: string;

  constructor(
    { baseDirectory, gitBinaryLocation }: FirmwareDownloaderProps,
    private logger: LoggerService
  ) {
    this.baseDirectory = baseDirectory;
    this.gitBinaryLocation = gitBinaryLocation;
  }

  getRepoDirectory(repository: string): string {
    return path.join(this.baseDirectory, path.basename(repository));
  }

  getSourceDirectory(directory: string, srcFolder: string): string {
    if (srcFolder === '/') {
      return directory;
    }
    return path.join(directory, srcFolder);
  }

  getSimpleGit(repository: string) {
    const options: SimpleGitOptions = {
      baseDir: this.getRepoDirectory(repository),
      binary: this.gitBinaryLocation,
      maxConcurrentProcesses: 1,
      config: [],
      trimmed: false,
    };
    return simpleGit(options);
  }

  async clearLocks(directory: string): Promise<void> {
    const indexLockPath = path.join(directory, '.git', 'index.lock');
    if (existsSync(indexLockPath)) {
      try {
        await fs.unlink(indexLockPath);
      } catch (e) {
        this.logger.error('failed to clear .git/index.lock', undefined, {
          directory,
          err: e,
        });
      }
    }
  }

  async syncRepo(repository: string, srcFolder: string): Promise<void> {
    const directory = this.getRepoDirectory(repository);

    if (!existsSync(directory)) {
      await fs.mkdir(directory, { recursive: true });
    }

    await this.clearLocks(directory);

    const git = this.getSimpleGit(directory);

    let isTargetDirectoryEmpty: boolean =
      (await fs.readdir(directory)).length === 0;

    // if directory is not empty and it is not a valid repo, remove the existing files
    if (!isTargetDirectoryEmpty && !(await git.checkIsRepo())) {
      this.logger.log(
        'Invalid git repository detected, removing the existing files',
        { directory }
      );
      await fs.rm(directory, { recursive: true, force: true });
      await fs.mkdir(directory, { recursive: true });
      isTargetDirectoryEmpty = true;
    }

    if (isTargetDirectoryEmpty) {
      await git.clone(repository, directory, [
        '--no-checkout',
        '--filter=blob:none',
      ]);
      if (!srcFolder || srcFolder.length === 0 || srcFolder === '/') {
        await git.raw('checkout');
      } else {
        await git.raw('sparse-checkout', 'set', srcFolder);
      }
    } else {
      await git.reset(ResetMode.HARD);
      await git.fetch('origin', ['--tags']);
    }
  }

  async checkoutTag(
    repository: string,
    srcFolder: string,
    tagName: string
  ): Promise<FirmwareResult> {
    const directory = this.getRepoDirectory(repository);
    await this.syncRepo(repository, srcFolder);
    const git = this.getSimpleGit(directory);
    await git.checkout(tagName);
    return {
      path: this.getSourceDirectory(directory, srcFolder),
    };
  }

  async checkoutBranch(
    repository: string,
    srcFolder: string,
    branch: string
  ): Promise<FirmwareResult> {
    const directory = this.getRepoDirectory(repository);
    await this.syncRepo(repository, srcFolder);
    const git = this.getSimpleGit(directory);
    await git.checkout(`origin/${branch}`);
    return {
      path: this.getSourceDirectory(directory, srcFolder),
    };
  }

  async checkoutCommit(
    repository: string,
    srcFolder: string,
    commit: string
  ): Promise<FirmwareResult> {
    const directory = this.getRepoDirectory(repository);
    await this.syncRepo(repository, srcFolder);
    const git = this.getSimpleGit(directory);
    await git.checkout(commit);
    return {
      path: this.getSourceDirectory(directory, srcFolder),
    };
  }
}
