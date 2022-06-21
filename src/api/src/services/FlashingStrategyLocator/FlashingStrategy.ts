import BuildFlashFirmwareResult from '../../models/BuildFlashFirmwareResult';
import { BuildFlashFirmwareParams } from './BuildFlashFirmwareParams';

export interface FlashingStrategy {
  isCompatible: (
    params: BuildFlashFirmwareParams,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ) => Promise<boolean>;

  buildFlashFirmware: (
    params: BuildFlashFirmwareParams,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ) => Promise<BuildFlashFirmwareResult>;

  clearFirmwareFiles(): Promise<void>;
}
