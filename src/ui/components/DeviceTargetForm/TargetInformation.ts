import { DeviceTarget } from '../../gql/generated/types';
import { FlashingMethod } from './FlashingMethod';

export interface TargetInformation {
  target: DeviceTarget;
  device: string;
  category: string;
  flashingMethod: FlashingMethod | null;
}
