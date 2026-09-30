import espCrc32Le from './espCrc32';
import {
  buildNvsImage,
  NVS_BLOB_SIZE,
  NVS_KEY,
  readNvsBlob,
} from './nvsImage';

const PAGE_SIZE = 4096;
const PARTITION_SIZE = 0x5000;

const blob = (): Buffer => {
  const data = Buffer.alloc(NVS_BLOB_SIZE, 0);
  data.write('receiver configuration', 0, 'ascii');
  return data;
};

describe('buildNvsImage', () => {
  it('fills the whole partition and leaves the spare pages erased', () => {
    const image = buildNvsImage(blob(), { partitionSize: PARTITION_SIZE });
    expect(image.length).toEqual(PARTITION_SIZE);
    const spare = image.subarray(PAGE_SIZE);
    expect(spare.every((byte) => byte === 0xff)).toEqual(true);
  });

  it('writes a page header the firmware accepts', () => {
    const image = buildNvsImage(blob(), { partitionSize: PARTITION_SIZE });
    expect(image.readUInt32LE(0)).toEqual(0xfffffffe); // active
    expect(image.readUInt32LE(4)).toEqual(0); // first sequence number
    expect(image[8]).toEqual(0xfe); // format version 2
    expect(image.readUInt32LE(28)).toEqual(espCrc32Le(image.subarray(4, 28)));
  });

  it('seals every written entry with a valid crc', () => {
    const image = buildNvsImage(blob(), { partitionSize: PARTITION_SIZE });
    const entries = [0, 1, 34]; // namespace, blob header, blob index
    entries.forEach((index) => {
      const start = 64 + index * 32;
      const entry = image.subarray(start, start + 32);
      const covered = Buffer.concat([
        entry.subarray(0, 4),
        entry.subarray(8, 32),
      ]);
      expect(entry.readUInt32LE(4)).toEqual(espCrc32Le(covered));
    });
  });

  it('marks used entries as written and the rest as empty', () => {
    const image = buildNvsImage(blob(), { partitionSize: PARTITION_SIZE });
    const stateOf = (index: number): number => {
      const byte = image[32 + Math.floor(index / 4)];
      return (byte >> ((index % 4) * 2)) & 0b11;
    };
    // namespace entry, blob header plus 32 payload entries, blob index
    for (let i = 0; i < 35; i++) {
      expect(stateOf(i)).toEqual(0b10);
    }
    expect(stateOf(35)).toEqual(0b11);
    expect(stateOf(125)).toEqual(0b11);
  });

  it('can be read back', () => {
    const data = blob();
    const image = buildNvsImage(data, { partitionSize: PARTITION_SIZE });
    const result = readNvsBlob(image, NVS_KEY);
    expect(result).not.toBeNull();
    expect(result?.namespaceIndex).toEqual(1);
    expect(result?.data.equals(data)).toEqual(true);
  });

  it('records the blob checksum', () => {
    const data = blob();
    const image = buildNvsImage(data, { partitionSize: PARTITION_SIZE });
    expect(image.readUInt32LE(64 + 32 + 28)).toEqual(espCrc32Le(data));
  });

  it('refuses a partition size that is not made of pages', () => {
    expect(() => buildNvsImage(blob(), { partitionSize: 5000 })).toThrow();
  });
});
