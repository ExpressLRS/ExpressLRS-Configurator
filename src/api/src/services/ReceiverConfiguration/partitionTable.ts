/**
 * Reader for the ESP-IDF partition table, which the firmware artifacts ship as
 * partitions.bin and which is flashed to 0x8000 on every ESP32 target.
 *
 * Entries are 32 bytes and start with the magic 0xAA 0x50.
 */

export const PARTITION_TABLE_OFFSET = 0x8000;
export const PARTITION_TABLE_SIZE = 0x1000;

const ENTRY_SIZE = 32;
const ENTRY_MAGIC = 0x50aa;

const TYPE_DATA = 1;
const SUBTYPE_NVS = 2;

export interface Partition {
  type: number;
  subtype: number;
  offset: number;
  size: number;
  label: string;
}

export const readPartitionTable = (image: Buffer): Partition[] => {
  const partitions: Partition[] = [];
  for (let at = 0; at + ENTRY_SIZE <= image.length; at += ENTRY_SIZE) {
    if (image.readUInt16LE(at) !== ENTRY_MAGIC) {
      continue;
    }
    partitions.push({
      type: image[at + 2],
      subtype: image[at + 3],
      offset: image.readUInt32LE(at + 4),
      size: image.readUInt32LE(at + 8),
      label: image.toString('ascii', at + 12, at + 28).split('\0')[0],
    });
  }
  return partitions;
};

export const findNvsPartition = (partitions: Partition[]): Partition | null => {
  return (
    partitions.find(
      (partition) =>
        partition.type === TYPE_DATA && partition.subtype === SUBTYPE_NVS,
    ) ?? null
  );
};

/**
 * The lowest partition that starts after the given offset, used to make sure an
 * appended image cannot run into whatever is flashed next.
 */
export const findNextPartitionAfter = (
  partitions: Partition[],
  offset: number,
): Partition | null => {
  return (
    partitions
      .filter((partition) => partition.offset > offset)
      .sort((a, b) => a.offset - b.offset)[0] ?? null
  );
};
