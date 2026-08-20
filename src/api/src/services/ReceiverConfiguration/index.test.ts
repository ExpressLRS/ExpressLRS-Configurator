import ReceiverConfigurationService from '.';
import { readNvsBlob } from './nvsImage';
import { RX_CONFIG_SIZE } from './rxConfig';

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

const partitionsImage = (nvsOffset = 0x9000, nvsSize = 0x5000): Buffer =>
  Buffer.concat([
    entry(1, 2, nvsOffset, nvsSize, 'nvs'),
    entry(1, 0, 0xe000, 0x2000, 'otadata'),
    entry(0, 0x10, 0x10000, 0x1f0000, 'app0'),
    Buffer.alloc(0xc00 - 96, 0xff),
  ]);

describe('ReceiverConfigurationService', () => {
  const service = new ReceiverConfigurationService();

  it('appends the configuration so it lands on the nvs partition', () => {
    const image = service.buildPartitionsImageWithConfig(
      partitionsImage(),
      { serialProtocol: 2 },
      {},
      {},
    );
    expect(image).not.toBeNull();
    // partition table at 0x8000 padded up to nvs at 0x9000, then 0x5000 of nvs
    expect(image?.length).toEqual(0x1000 + 0x5000);
  });

  it('stops exactly where the next partition begins', () => {
    const image = service.buildPartitionsImageWithConfig(
      partitionsImage(),
      {},
      {},
      {},
    );
    // 0x8000 + length must not run into otadata at 0xe000
    expect(0x8000 + (image?.length ?? 0)).toEqual(0xe000);
  });

  it('keeps the original partition table intact', () => {
    const original = partitionsImage();
    const image = service.buildPartitionsImageWithConfig(original, {}, {}, {});
    expect(image?.subarray(0, 96).equals(original.subarray(0, 96))).toEqual(true);
  });

  it('writes a configuration a receiver can read back', () => {
    const image = service.buildPartitionsImageWithConfig(
      partitionsImage(),
      { serialProtocol: 3, failsafeMode: 2, modelId: 7 },
      {},
      {},
    );
    const blob = readNvsBlob(image!.subarray(0x1000), 'eeprom');
    expect(blob).not.toBeNull();
    const config = blob!.data;
    expect(config[23] & 0x0f).toEqual(3);
    expect((config[23] >> 4) & 0x03).toEqual(2);
    expect(config[22]).toEqual(7);
    expect(config.length).toBeGreaterThanOrEqual(RX_CONFIG_SIZE);
  });

  it('takes the uid and flash discriminator from the firmware', () => {
    const image = service.buildPartitionsImageWithConfig(
      partitionsImage(),
      {},
      {},
      { uid: [11, 22, 33, 44, 55, 66], flashDiscriminator: 305419896 },
    );
    const config = readNvsBlob(image!.subarray(0x1000), 'eeprom')!.data;
    expect([...config.subarray(4, 10)]).toEqual([11, 22, 33, 44, 55, 66]);
    expect(config.readUInt32LE(12)).toEqual(305419896);
  });

  it('declines instead of throwing on an nvs partition it cannot fill', () => {
    // a flash must never fail because of an unexpected layout
    expect(
      service.buildPartitionsImageWithConfig(
        partitionsImage(0x9000, 0x1000),
        {},
        {},
        {},
      ),
    ).toBeNull();
  });

  it('declines when the nvs partition would reach the ota data', () => {
    expect(
      service.buildPartitionsImageWithConfig(
        partitionsImage(0xd000, 0x5000),
        {},
        {},
        {},
      ),
    ).toBeNull();
  });

  it('declines when the target has no nvs partition', () => {
    const image = Buffer.concat([
      entry(0, 0x10, 0x10000, 0x1f0000, 'app0'),
      Buffer.alloc(64, 0xff),
    ]);
    expect(
      service.buildPartitionsImageWithConfig(image, {}, {}, {}),
    ).toBeNull();
  });

  it('declines when nvs would run into the next partition', () => {
    expect(
      service.buildPartitionsImageWithConfig(
        partitionsImage(0x9000, 0x6000),
        {},
        {},
        {},
      ),
    ).toBeNull();
  });
});
