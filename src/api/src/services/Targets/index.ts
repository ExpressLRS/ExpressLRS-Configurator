import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';
import fetch from 'node-fetch';
import * as path from 'path';
import fs from 'fs';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';
import FirmwareSource from '../../models/enum/FirmwareSource';
import TargetArgs from '../../graphql/args/Target';
import { LoggerService } from '../../logger';

export interface ITargets {
  loadTargetsList(
    owner: string,
    repository: string,
    args: TargetArgs
  ): Promise<string[]>;
}

@Service()
export default class TargetsService implements ITargets {
  client: Octokit;

  constructor(private logger: LoggerService) {
    this.client = new Octokit();
  }

  extractTargets(data: string): string[] {
    const targetsRegexp = /\[env:(.*)\]/g;
    const parsedResults = [...data.matchAll(targetsRegexp)];

    return parsedResults
      .map((matchedGroups) => {
        if (matchedGroups.length === 2) {
          return matchedGroups[1];
        }
        return '';
      })
      .filter((i) => i);
  }

  async loadTargetsFromGitHub(
    owner: string,
    repository: string,
    ref: string
  ): Promise<string[]> {
    if (!ref || ref.length === 0) {
      return [];
    }

    try {
      const response = await this.client.repos.getContent({
        owner,
        repo: repository,
        path: 'src/targets',
        ref,
      });

      const { data } = response;

      // ignore non-directory responses
      if (!Array.isArray(data)) {
        return [];
      }

      const values = await Promise.all(
        data.map(async (item) => {
          if (item.download_url) {
            const file = await fetch(item.download_url);
            const body = await file.text();
            if (!file.ok) {
              this.logger?.log(`failed to get ${file}`, {
                status: response.status,
                body,
              });
              throw new Error(
                `failed to get ${item.download_url}: ${response.status}, ${body}`
              );
            }

            return this.extractTargets(body);
          }
          return [];
        })
      );

      return values.reduce<string[]>((prev, curr) => {
        return prev.concat(curr);
      }, []);
    } catch (err) {
      this.logger?.log(`failed to get targets from ref: ${ref}`, err);
      throw new Error(`failed to get targets from ref: ${ref}.  Error: ${err}`);
    }
  }

  async loadTargetsFromLocal(localPath: string): Promise<string[]> {
    const targetsDirectory = path.join(localPath, 'targets');

    if (!fs.existsSync(targetsDirectory)) {
      return [];
    }

    const contents = await fs.promises.readdir(targetsDirectory);

    const files = await Promise.all(
      contents.map(async (file) => {
        const filePath = path.join(targetsDirectory, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
          const data = await fs.promises.readFile(filePath, 'utf8');
          return this.extractTargets(data);
        }
        return [];
      })
    );

    return files.reduce<string[]>((prev, curr) => {
      return prev.concat(curr);
    }, []);
  }

  async loadTargetsList(
    owner: string,
    repository: string,
    args: TargetArgs
  ): Promise<DeviceTarget[]> {
    let availableTargets: string[] = [];
    switch (args.source) {
      case FirmwareSource.GitBranch:
        availableTargets = await this.loadTargetsFromGitHub(
          owner,
          repository,
          args.gitBranch
        );
        break;
      case FirmwareSource.GitCommit:
        availableTargets = await this.loadTargetsFromGitHub(
          owner,
          repository,
          args.gitCommit
        );
        break;
      case FirmwareSource.GitTag:
        availableTargets = await this.loadTargetsFromGitHub(
          owner,
          repository,
          args.gitTag
        );
        break;
      case FirmwareSource.Local:
        availableTargets = await this.loadTargetsFromLocal(args.localPath);
        break;
      case FirmwareSource.GitPullRequest:
        if (args.gitPullRequest) {
          availableTargets = await this.loadTargetsFromGitHub(
            owner,
            repository,
            args.gitPullRequest.headCommitHash
          );
        }
        break;
      default:
        throw new Error(
          `unsupported firmware source for the targets service: ${args.source}`
        );
    }

    return Object.values(DeviceTarget).filter((item) =>
      availableTargets.find((target) => target === `${item}`)
    );
  }
}
