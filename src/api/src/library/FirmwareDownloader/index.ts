/* eslint-disable no-await-in-loop */
import simpleGit, { ResetMode, SimpleGit, SimpleGitOptions } from 'simple-git';
import * as fs from 'fs';
import path from 'path';
import Commander, { CommandResult } from '../Commander';

interface FirmwareDownloaderProps {
  baseDirectory: string;
  gitBinaryLocation: string;
}

export interface FirmwareResult {
  path: string;
}

export interface IFirmwareDownloader {
  checkoutTag(repository: string, tagName: string): Promise<FirmwareResult>;

  checkoutBranch(
    repository: string,
    branchName: string
  ): Promise<FirmwareResult>;

  checkoutCommit(repository: string, commit: string): Promise<FirmwareResult>;
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
          fs.existsSync(executable) &&
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

  git: SimpleGit;

  constructor({ baseDirectory, gitBinaryLocation }: FirmwareDownloaderProps) {
    this.baseDirectory = baseDirectory;
    const options: SimpleGitOptions = {
      baseDir: this.baseDirectory,
      binary: gitBinaryLocation,
      maxConcurrentProcesses: 1,
      config: [],
    };
    this.git = simpleGit(options);
  }

  async syncRepo(repository: string): Promise<void> {
    const isTargetDirectoryEmpty: boolean = await new Promise(
      (resolve, reject) => {
        fs.readdir(this.baseDirectory, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data.length === 0);
        });
      }
    );

    if (isTargetDirectoryEmpty) {
      await this.git.clone(repository, this.baseDirectory, [
        '--no-checkout',
        '--filter=blob:none',
      ]);

      await this.git.raw('sparse-checkout', 'set', 'src');
    } else {
      await this.git.reset(ResetMode.HARD);
      await this.git.fetch(['--tags']);
    }
  }

  async checkoutTag(
    repository: string,
    tagName: string
  ): Promise<FirmwareResult> {
    await this.syncRepo(repository);
    await this.git.checkout(tagName);
    return {
      path: path.join(this.baseDirectory, 'src'),
    };
  }

  async checkoutBranch(
    repository: string,
    branch: string
  ): Promise<FirmwareResult> {
    await this.syncRepo(repository);
    await this.git.checkout(`origin/${branch}`);
    return {
      path: path.join(this.baseDirectory, 'src'),
    };
  }

  async checkoutCommit(
    repository: string,
    commit: string
  ): Promise<FirmwareResult> {
    await this.syncRepo(repository);
    await this.git.checkout(commit);
    return {
      path: path.join(this.baseDirectory, 'src'),
    };
  }
}
