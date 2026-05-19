import BuildJobType from '../../models/enum/BuildJobType';
import FlashingMethod from '../../models/enum/FlashingMethod';
import UserDefine from '../../models/UserDefine';
import { FirmwareVersionData } from './FirmwareVersionData';

export interface BuildFlashFirmwareParams {
  type: BuildJobType;
  serialDevice?: string | undefined;
  firmware: FirmwareVersionData;
  target: string;
  flashingMethod: FlashingMethod;
  userDefines: UserDefine[];
  erase: boolean;
  forceFlash: boolean;
}
