import espCrc32Le from './espCrc32';

describe('espCrc32Le', () => {
  it('matches the crc of a real nvs page header', () => {
    // header of an active page as read from a receiver: sequence number 12,
    // format version 2, the rest erased. The device stored crc 0x02b18f65.
    const header = Buffer.alloc(24, 0xff);
    header.writeUInt32LE(12, 0);
    header[4] = 0xfe;
    expect(espCrc32Le(header)).toEqual(0x02b18f65);
  });

  it('matches the well known check value when seeded like a plain crc32', () => {
    // the rom function inverts the seed, so a zero seed is what makes it
    // behave like the textbook crc32 of "123456789"
    expect(espCrc32Le(Buffer.from('123456789', 'ascii'), 0)).toEqual(0xcbf43926);
  });

  it('inverts an empty run', () => {
    expect(espCrc32Le(Buffer.alloc(0))).toEqual(0xffffffff);
  });
});
