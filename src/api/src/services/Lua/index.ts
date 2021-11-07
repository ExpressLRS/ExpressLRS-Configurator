import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';
import * as path from 'path';
import fs from 'fs';
import FirmwareSource from '../../models/enum/FirmwareSource';
import TargetArgs from '../../graphql/args/Target';
import { LoggerService } from '../../logger';

interface GitRepository {
  owner: string;
  repositoryName: string;
  srcFolder: string;
}

export interface ILua {
  loadLuaScript(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<string | null>;
}

const luaRegexp = /elrs.*\.lua/gim;

@Service()
export default class LuaService implements ILua {
  client: Octokit;

  constructor(private logger: LoggerService) {
    this.client = new Octokit();
  }

  async loadLuaFromGitHub(
    gitRepositoryOwner: string,
    gitRepositoryName: string,
    gitRepositorySrcFolder: string,
    ref: string
  ): Promise<string | null> {
    if (!ref || ref.length === 0) {
      return null;
    }
    try {
      const response = await this.client.repos.getContent({
        owner: gitRepositoryOwner,
        repo: gitRepositoryName,
        path: `${gitRepositorySrcFolder}/lua`,
        ref,
      });

      const { data } = response;

      // ignore non-directory responses
      if (!Array.isArray(data)) {
        return null;
      }

      const sorted = data
        .filter((item) => {
          return item.name.match(luaRegexp);
        })
        .sort((a, b) => {
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return -1;
          }

          return 1;
        });

      if (sorted.length > 0) {
        return sorted[0].download_url;
      }

      return null;
    } catch (err) {
      this.logger?.log(`failed to get lua from ref: ${ref}`, { error: err });
      throw new Error(`failed to get lua from ref: ${ref}.  Error: ${err}`);
    }
  }

  async loadLuaFromLocal(localPath: string): Promise<string | null> {
    const luaDirectory = path.join(localPath, 'lua');

    if (!fs.existsSync(luaDirectory)) {
      return null;
    }

    const contents = await fs.promises.readdir(luaDirectory);

    const sorted = contents
      .filter((item) => {
        return path.basename(item).match(luaRegexp);
      })
      .sort((a, b) => {
        if (a.toUpperCase() > b.toUpperCase()) {
          return -1;
        }

        return 1;
      });

    if (sorted.length > 0) {
      return sorted[0];
    }

    return null;
  }

  async loadLuaScript(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<string | null> {
    let luaScript: string | null = null;

    switch (args.source) {
      case FirmwareSource.GitBranch:
        luaScript = await this.loadLuaFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitBranch
        );
        break;
      case FirmwareSource.GitCommit:
        luaScript = await this.loadLuaFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitCommit
        );
        break;
      case FirmwareSource.GitTag:
        luaScript = await this.loadLuaFromGitHub(
          gitRepository.owner,
          gitRepository.repositoryName,
          gitRepository.srcFolder,
          args.gitTag
        );
        break;
      case FirmwareSource.Local:
        luaScript = await this.loadLuaFromLocal(args.localPath);
        break;
      case FirmwareSource.GitPullRequest:
        if (args.gitPullRequest) {
          luaScript = await this.loadLuaFromGitHub(
            gitRepository.owner,
            gitRepository.repositoryName,
            gitRepository.srcFolder,
            args.gitPullRequest.headCommitHash
          );
        }
        break;
      default:
        throw new Error(
          `unsupported firmware source for the lua service: ${args.source}`
        );
    }

    return luaScript;
  }
}
