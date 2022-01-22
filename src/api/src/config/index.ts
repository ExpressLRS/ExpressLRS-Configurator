import { Token } from 'typedi';

export enum FirmwareTargetsLoaderType {
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
  targetsLoader: FirmwareTargetsLoaderType;
  targetsStoragePath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
