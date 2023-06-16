import BuildJobType from '../../models/enum/BuildJobType';
import UserDefinesMode from '../../models/enum/UserDefinesMode';
import UserDefine from '../../models/UserDefine';
import { FirmwareVersionData } from './FirmwareVersionData';

export interface BuildFlashFirmwareParams {
  type: BuildJobType;
  serialDevice?: string | undefined;
  firmware: FirmwareVersionData;
  target: string;
  userDefinesMode: UserDefinesMode;
  userDefines: UserDefine[];
  userDefinesTxt: string;
  erase: boolean;
}
