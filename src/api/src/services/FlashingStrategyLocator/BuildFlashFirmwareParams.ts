import BuildJobType from '../../models/enum/BuildJobType';
import FlashingMethod from '../../models/enum/FlashingMethod';
import UserDefine from '../../models/UserDefine';
import { FirmwareVersionData } from './FirmwareVersionData';
import { ReceiverSettings } from '../ReceiverConfiguration/rxConfig';

export interface BuildFlashFirmwareParams {
  type: BuildJobType;
  serialDevice?: string | undefined;
  firmware: FirmwareVersionData;
  target: string;
  flashingMethod: FlashingMethod;
  userDefines: UserDefine[];
  erase: boolean;
  forceFlash: boolean;
  /** when set, the settings are written to the receiver during the flash */
  receiverConfiguration?: ReceiverSettings & { enabled: boolean };
}
