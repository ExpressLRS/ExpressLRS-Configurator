import { Token } from 'typedi';

export enum FirmwareParamsLoaderType {
  Git = 'git',
  Http = 'http',
}

export interface IConfig {
  configuratorGit: {
    url: string;
    owner: string;
    repositoryName: string;
  };
  multicastDnsSimulatorEnabled: boolean;
  devicesPath: string;
  firmwaresPath: string;
  PATH: string;
  env: NodeJS.ProcessEnv;
  getPlatformioPath: string;
  platformioStateTempStoragePath: string;
  targetsLoader: FirmwareParamsLoaderType;
  targetsStoragePath: string;
  userDefinesLoader: FirmwareParamsLoaderType;
  userDefinesStoragePath: string;
  userDataPath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
