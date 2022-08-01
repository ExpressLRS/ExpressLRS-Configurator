import { Firmware } from './Firmware';

export interface FirmwareFiles {
  bootloader?: Firmware;
  partitions?: Firmware;
  boot_app0?: Firmware;
  firmware?: Firmware;
}
