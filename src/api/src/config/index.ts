import { Token } from 'typedi';
import { GitRepo } from '../services/Firmware';

export interface IConfig {
  git: GitRepo;
  firmwaresPath: string;
  PATH: string;
  env: NodeJS.ProcessEnv;
  getPlatformioPath: string;
}

export const ConfigToken = new Token<IConfig>('CONFIG_TOKEN');
