import fs from 'fs';
import path from 'path';
import { buildNvsImage, NVS_BLOB_SIZE } from './nvsImage';
import { readFirmwareOptions } from './firmwareOptions';
import {
  buildRxConfig,
  padToEepromSize,
  ReceiverHardware,
  ReceiverSettings,
} from './rxConfig';
import {
  findNextPartitionAfter,
  findNvsPartition,
  PARTITION_TABLE_OFFSET,
  PARTITION_TABLE_SIZE,
  readPartitionTable,
} from './partitionTable';
import { LoggerService } from '../../logger';

export * from './rxConfig';

/** where binary_flash.py puts boot_app0.bin on every ESP32 UART flash */
const OTA_DATA_FLASH_OFFSET = 0xe000;

export interface FirmwareIdentity {
  /** uid the firmware is built with, derived from the binding phrase */
  uid?: number[];
  /** discriminator the firmware is built with */
  flashDiscriminator?: number;
}

/**
 * Writes the receiver configuration during a normal flash, so a receiver is
 * fully set up when it boots for the first time and does not have to be visited
 * over WiFi or Lua afterwards.
 *
 * The whole NVS partition is replaced, so the receiver starts from the
 * settings written here and from nothing else: an earlier binding it was not
 * flashed with is gone, and the calibration data the chip keeps there is
 * measured again on the next boot.
 *
 * ExpressLRS flashes ESP32 targets over UART with a single esptool call that
 * writes the partition table to 0x8000, the ota data to 0xe000 and the
 * application to 0x10000. The NVS partition holding the configuration sits
 * between the partition table and the ota data, so appending the configuration
 * image to partitions.bin puts it on the device within that same call, without
 * a second connection or another press of the boot button.
 */
export default class ReceiverConfigurationService {
  constructor(private logger?: LoggerService) {}

  /**
   * Appends the configuration image to the partition table image.
   * Returns null when the layout does not allow it, in which case flashing
   * carries on unchanged.
   */
  buildPartitionsImageWithConfig(
    partitionsImage: Buffer,
    settings: ReceiverSettings,
    hardware: ReceiverHardware,
    identity: FirmwareIdentity,
  ): Buffer | null {
    const partitions = readPartitionTable(partitionsImage);
    if (partitions.length === 0) {
      this.logger?.error('receiver configuration: no partition table found');
      return null;
    }
    const nvs = findNvsPartition(partitions);
    if (!nvs) {
      this.logger?.error('receiver configuration: target has no nvs partition');
      return null;
    }
    if (nvs.offset < PARTITION_TABLE_OFFSET + PARTITION_TABLE_SIZE) {
      this.logger?.error('receiver configuration: nvs overlaps the partition table');
      return null;
    }

    // the appended image must stop before whatever esptool writes next
    const next = findNextPartitionAfter(partitions, nvs.offset);
    if (next && nvs.offset + nvs.size > next.offset) {
      this.logger?.error('receiver configuration: nvs partition overlaps the next partition');
      return null;
    }
    // the flasher writes the ota data to 0xe000 in the same call on every
    // target this feature runs for, the appended image must never reach it
    if (nvs.offset + nvs.size > OTA_DATA_FLASH_OFFSET) {
      this.logger?.error('receiver configuration: nvs partition extends past the ota data');
      return null;
    }

    const config = buildRxConfig({
      settings,
      hardware,
      uid: identity.uid,
      flashDiscriminator: identity.flashDiscriminator,
    });

    let nvsImage: Buffer;
    try {
      nvsImage = buildNvsImage(padToEepromSize(config, NVS_BLOB_SIZE), {
        partitionSize: nvs.size,
      });
    } catch (e) {
      // an unexpected geometry must leave the flash alone, never break it
      this.logger?.error('receiver configuration: could not build the image', undefined, {
        err: e,
      });
      return null;
    }

    // pad the partition table out to where nvs starts, then append it
    const image = Buffer.alloc(nvs.offset - PARTITION_TABLE_OFFSET, 0xff);
    partitionsImage.copy(image, 0, 0, Math.min(partitionsImage.length, image.length));

    this.logger?.log('receiver configuration prepared', {
      nvsOffset: `0x${nvs.offset.toString(16)}`,
      nvsSize: nvs.size,
      hasUid: identity.uid !== undefined,
      hasFlashDiscriminator: identity.flashDiscriminator !== undefined,
    });

    return Buffer.concat([image, nvsImage]);
  }

  /**
   * Rewrites partitions.bin inside a firmware artifacts directory so the flash
   * that follows also writes the configuration. Returns true when it applied.
   */
  async applyToArtifacts(
    artifactsDirectory: string,
    settings: ReceiverSettings,
    hardware: ReceiverHardware,
    identity: FirmwareIdentity,
  ): Promise<boolean> {
    const partitionsPath = path.join(artifactsDirectory, 'partitions.bin');
    if (!fs.existsSync(partitionsPath)) {
      this.logger?.log('receiver configuration: no partitions.bin, skipping', {
        artifactsDirectory,
      });
      return false;
    }
    const partitionsImage = await fs.promises.readFile(partitionsPath);

    // when the caller does not know them, the firmware that is about to be
    // flashed is asked instead
    let resolved = identity;
    if (identity.uid === undefined || identity.flashDiscriminator === undefined) {
      const firmwarePath = path.join(artifactsDirectory, 'firmware.bin');
      if (fs.existsSync(firmwarePath)) {
        const options = readFirmwareOptions(
          await fs.promises.readFile(firmwarePath),
        );
        resolved = {
          uid: identity.uid ?? options?.uid,
          flashDiscriminator:
            identity.flashDiscriminator ?? options?.flashDiscriminator,
        };
      }
    }

    const patched = this.buildPartitionsImageWithConfig(
      partitionsImage,
      settings,
      hardware,
      resolved,
    );
    if (!patched) {
      return false;
    }
    await fs.promises.writeFile(partitionsPath, patched);
    return true;
  }
}
