import { Token } from 'typedi';

export interface IConfig {
  configuratorGit: {
    url: string;
    owner: string;
    repositoryName: string;
  };
  firmwaresPath: string;
  PATH: string;
  env: NodeJS.ProcessEnv;
  getPlatformioPath: string;
  platformioStateTempStoragePath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
