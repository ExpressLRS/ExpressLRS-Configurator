import BuildJobType from '../../models/enum/BuildJobType';
import UserDefine from '../../models/UserDefine';
import { FirmwareVersionData } from './FirmwareVersionData';

export interface BuildFlashFirmwareParams {
  type: BuildJobType;
  serialDevice?: string | undefined;
  firmware: FirmwareVersionData;
  target: string;
  userDefines: UserDefine[];
  erase: boolean;
  forceFlash: boolean;
}
