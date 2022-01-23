import { Service } from 'typedi';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import path from 'path';
import { LoggerService } from '../../logger';
import DeviceService from '../Device';
import extractTargetFiles from './extractTargetFiles';
import extractTargets from './extractTargets';
import TargetArgs from '../../graphql/args/Target';
import Device from '../../models/Device';
import FirmwareSource from '../../models/enum/FirmwareSource';
import loadTargetsFromDirectory from './loadTargetsFromDirectory';
import { GitRepository, ITargets } from './index';

@Service()
export default class HttpTargetsService implements ITargets {
  client: Octokit;

  constructor(
    private logger: LoggerService,
    private deviceService: DeviceService
  ) {
    this.client = new Octokit();
  }

  async downloadFile(url: string): Promise<string> {
    const file = await fetch(url);
    const body = await file.text();
    if (!file.ok) {
      this.logger?.log(`failed to get ${file}`, {
        status: file.status,
        body,
      });
      throw new Error(`failed to get ${url}: ${file.status}, ${body}`);
    }
    return body;
  }

  async loadTargetsFromGitHub(
    gitRepositoryOwner: string,
    gitRepositoryName: string,
    gitRepositorySrcFolder: string,
    ref: string
  ): Promise<string[]> {
    if (!ref || ref.length === 0) {
      return [];
    }
    try {
      const platformioFile = `https://raw.githubusercontent.com/${gitRepositoryOwner}/${gitRepositoryName}/${ref}${gitRepositorySrcFolder}/platformio.ini`;
      const platformioFileContents = await this.downloadFile(platformioFile);

      const targetFiles = extractTargetFiles(platformioFileContents);

      const values = await Promise.all(
        targetFiles.map(async (item) => {
          const contents = await this.downloadFile(
            `https://raw.githubusercontent.com/${gitRepositoryOwner}/${gitRepositoryName}/${ref}${gitRepositorySrcFolder}/${item}`
          );
          const targets = extractTargets(contents);
          return targets;
        })
      );

      const platformioFileTargets = extractTargets(platformioFileContents);

      values.push(platformioFileTargets);

      return values.reduce<string[]>((prev, curr) => {
        return prev.concat(curr);
      }, []);
    } catch (err) {
      this.logger?.log(`failed to get targets from ref: ${ref}`, { err });
      throw new Error(`failed to get targets from ref: ${ref}.  Error: ${err}`);
    }
  }

  async loadTargetsList(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]> {
    let availableTargets: string[] = [];
    switch (args.source) {
      case FirmwareSource.GitBranch:
        availableTargets = await this.loadTargetsFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitBranch
        );
        break;
      case FirmwareSource.GitCommit:
        availableTargets = await this.loadTargetsFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitCommit
        );
        break;
      case FirmwareSource.GitTag:
        availableTargets = await this.loadTargetsFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitTag
        );
        break;
      case FirmwareSource.GitPullRequest:
        if (args.gitPullRequest) {
          availableTargets = await this.loadTargetsFromGitHub(
            gitRepository.owner,
            gitRepository.repositoryName,
            gitRepository.srcFolder,
            args.gitPullRequest.headCommitHash
          );
        }
        break;
      case FirmwareSource.Local:
        availableTargets = await loadTargetsFromDirectory(
          path.join(args.localPath, 'targets')
        );
        break;
      default:
        throw new Error(
          `unsupported firmware source for the targets service: ${args.source}`
        );
    }
    const devices = this.deviceService.getDevices();
    return devices
      .map((value) => {
        const device = { ...value };
        device.targets = value.targets.filter((item) =>
          availableTargets.find((target) => target === item.name)
        );
        return device;
      })
      .filter((item) => item.targets.length > 0);
  }
}
