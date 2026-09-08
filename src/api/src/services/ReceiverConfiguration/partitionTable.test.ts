import {
  findNextPartitionAfter,
  findNvsPartition,
  readPartitionTable,
} from './partitionTable';

const entry = (
  type: number,
  subtype: number,
  offset: number,
  size: number,
  label: string,
): Buffer => {
  const buffer = Buffer.alloc(32, 0);
  buffer.writeUInt16LE(0x50aa, 0);
  buffer[2] = type;
  buffer[3] = subtype;
  buffer.writeUInt32LE(offset, 4);
  buffer.writeUInt32LE(size, 8);
  buffer.write(label, 12, 'ascii');
  return buffer;
};

/** the layout ExpressLRS uses on its ESP32 receivers */
const table = (): Buffer =>
  Buffer.concat([
    entry(1, 2, 0x9000, 0x5000, 'nvs'),
    entry(1, 0, 0xe000, 0x2000, 'otadata'),
    entry(0, 0x10, 0x10000, 0x1f0000, 'app0'),
    Buffer.alloc(64, 0xff),
  ]);

describe('readPartitionTable', () => {
  it('reads every entry', () => {
    const partitions = readPartitionTable(table());
    expect(partitions.map((item) => item.label)).toEqual([
      'nvs',
      'otadata',
      'app0',
    ]);
    expect(partitions[0]).toEqual({
      type: 1,
      subtype: 2,
      offset: 0x9000,
      size: 0x5000,
      label: 'nvs',
    });
  });

  it('ignores the erased remainder of the sector', () => {
    expect(readPartitionTable(Buffer.alloc(4096, 0xff))).toEqual([]);
  });

  it('stops at the end of the table, like the firmware does', () => {
    // bytes that happen to look like an entry after the table has ended, ie.
    // inside an NVS image appended to partitions.bin, are not entries
    const image = Buffer.concat([
      table(),
      entry(1, 2, 0xf000, 0x1000, 'phantom'),
    ]);
    expect(readPartitionTable(image).map((item) => item.label)).toEqual([
      'nvs',
      'otadata',
      'app0',
    ]);
  });

  it('finds the nvs partition', () => {
    expect(findNvsPartition(readPartitionTable(table()))?.offset)
      .toEqual(0x9000);
  });

  it('finds what is flashed after the nvs partition', () => {
    const partitions = readPartitionTable(table());
    expect(findNextPartitionAfter(partitions, 0x9000)?.label).toEqual('otadata');
  });

  it('reports nothing after the last partition', () => {
    const partitions = readPartitionTable(table());
    expect(findNextPartitionAfter(partitions, 0x10000)).toBeNull();
  });
});
