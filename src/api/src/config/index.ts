import { Token } from 'typedi';

export interface IConfig {
  configuratorGit: {
    url: string;
    owner: string;
    repositoryName: string;
  };
  multicastDnsSimulatorEnabled: boolean;
  devicesPath: string;
  firmwaresPath: string;
  cloudCacheServer: string;
  firmwareCloudCachePath: string;
  PATH: string;
  env: NodeJS.ProcessEnv;
  getPlatformioPath: string;
  platformioStateTempStoragePath: string;
  targetsStoragePath: string;
  userDefinesStoragePath: string;
  userDataPath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
