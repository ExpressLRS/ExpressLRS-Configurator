import TargetArgs from '../../graphql/args/Target';
import GitRepository from '../../graphql/inputs/GitRepositoryInput';
import { BuildFlashFirmwareParams } from './BuildFlashFirmwareParams';
import Device from '../../models/Device';
import { UserDefineFilters } from '../UserDefinesLoader';
import UserDefine from '../../models/UserDefine';
import FirmwareSource from '../../models/enum/FirmwareSource';
import PullRequest from '../../models/PullRequest';
import BuildFlashFirmwareResult from '../../graphql/objects/BuildFlashFirmwareResult';

export interface IsCompatibleArgs {
  source: FirmwareSource;
  gitTag: string;
  gitBranch: string;
  gitCommit: string;
  localPath: string;
  gitPullRequest: PullRequest | null;
}

export interface FlashingStrategy {
  name: string;

  isCompatible: (
    params: IsCompatibleArgs,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ) => Promise<boolean>;

  buildFlashFirmware: (
    params: BuildFlashFirmwareParams,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ) => Promise<BuildFlashFirmwareResult>;

  availableFirmwareTargets: (
    args: TargetArgs,
    gitRepository: GitRepository
  ) => Promise<Device[]>;

  targetDeviceOptions: (
    input: UserDefineFilters,
    gitRepository: GitRepository
  ) => Promise<UserDefine[]>;

  clearFirmwareFiles(): Promise<void>;
}
