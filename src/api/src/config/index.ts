import { Token } from 'typedi';
import GitRepo from '../graphql/inputs/GitRepoInput';

export interface IConfig {
  configuratorGit: GitRepo;
  firmwaresPath: string;
  PATH: string;
  env: NodeJS.ProcessEnv;
  getPlatformioPath: string;
  platformioStateTempStoragePath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
