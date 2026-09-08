import espCrc32Le from './espCrc32';

/**
 * Builds an ESP-IDF NVS partition image holding a single blob, which is how the
 * Arduino EEPROM emulation on ESP32 stores the ExpressLRS receiver
 * configuration: namespace "eeprom", key "eeprom", 1024 bytes.
 *
 * The layout follows nvs_flash: 4 KB pages, a 32 byte page header, a 32 byte
 * entry state bitmap and 126 entries of 32 bytes each. Only the first page is
 * written, the remaining pages stay erased so the firmware can use them.
 */

const PAGE_SIZE = 4096;
const ENTRY_SIZE = 32;
const ENTRIES_PER_PAGE = 126;
const ENTRY_TABLE_OFFSET = 64;

const PAGE_STATE_ACTIVE = 0xfffffffe;
const PAGE_VERSION_2 = 0xfe;

const ENTRY_STATE_EMPTY = 0b11;
const ENTRY_STATE_WRITTEN = 0b10;

const TYPE_U8 = 0x01;
const TYPE_BLOB_DATA = 0x42;
const TYPE_BLOB_IDX = 0x48;

const NAMESPACE_INDEX_ENTRY = 0;
const CHUNK_INDEX_NONE = 0xff;

export const NVS_NAMESPACE = 'eeprom';
export const NVS_KEY = 'eeprom';
/** Arduino EEPROM emulation always stores the full EEPROM.begin() size */
export const NVS_BLOB_SIZE = 1024;

const writeKey = (entry: Buffer, key: string): void => {
  // keys are null padded, unlike the erased flash the rest of the image sits in
  entry.fill(0, 8, 24);
  entry.write(key.slice(0, 15), 8, 'ascii');
};

const sealEntry = (entry: Buffer): void => {
  // the entry crc covers the entry with its own crc field left out
  const covered = Buffer.concat([entry.subarray(0, 4), entry.subarray(8, 32)]);
  entry.writeUInt32LE(espCrc32Le(covered), 4);
};

const markEntries = (page: Buffer, count: number): void => {
  const bitmap = page.subarray(32, 64);
  bitmap.fill(0xff);
  for (let i = 0; i < count; i++) {
    const byte = Math.floor(i / 4);
    const shift = (i % 4) * 2;
    // two bits per entry, least significant pair first
    bitmap[byte] = (bitmap[byte] & ~(ENTRY_STATE_EMPTY << shift))
      | (ENTRY_STATE_WRITTEN << shift);
  }
};

export interface NvsImageOptions {
  /** size of the NVS partition on the device, from its partition table */
  partitionSize: number;
  namespaceIndex?: number;
}

export const buildNvsImage = (
  blob: Buffer,
  { partitionSize, namespaceIndex = 1 }: NvsImageOptions,
): Buffer => {
  if (partitionSize % PAGE_SIZE !== 0 || partitionSize < PAGE_SIZE * 2) {
    throw new Error(
      `NVS partition size ${partitionSize} is not a multiple of ${PAGE_SIZE} or too small`,
    );
  }
  // one entry holds the blob header, the payload follows in whole entries
  const dataEntries = Math.ceil(blob.length / ENTRY_SIZE);
  const span = dataEntries + 1;
  const usedEntries = span + 2; // namespace entry and blob index entry
  if (usedEntries > ENTRIES_PER_PAGE) {
    throw new Error(`blob of ${blob.length} bytes does not fit a single page`);
  }

  const image = Buffer.alloc(partitionSize, 0xff);
  const page = image.subarray(0, PAGE_SIZE);

  page.writeUInt32LE(PAGE_STATE_ACTIVE, 0);
  page.writeUInt32LE(0, 4); // sequence number of the first page
  page[8] = PAGE_VERSION_2;
  page.writeUInt32LE(espCrc32Le(page.subarray(4, 28)), 28);

  const entryAt = (index: number): Buffer => {
    const start = ENTRY_TABLE_OFFSET + index * ENTRY_SIZE;
    return page.subarray(start, start + ENTRY_SIZE);
  };

  // entry 0: register the namespace name and give it an index
  const namespaceEntry = entryAt(0);
  namespaceEntry[0] = NAMESPACE_INDEX_ENTRY;
  namespaceEntry[1] = TYPE_U8;
  namespaceEntry[2] = 1;
  namespaceEntry[3] = CHUNK_INDEX_NONE;
  writeKey(namespaceEntry, NVS_NAMESPACE);
  namespaceEntry[24] = namespaceIndex;
  sealEntry(namespaceEntry);

  // entry 1: the blob header, followed by the payload
  const blobEntry = entryAt(1);
  blobEntry[0] = namespaceIndex;
  blobEntry[1] = TYPE_BLOB_DATA;
  blobEntry[2] = span;
  blobEntry[3] = 0; // first (and only) chunk
  writeKey(blobEntry, NVS_KEY);
  blobEntry.writeUInt16LE(blob.length, 24);
  blobEntry.writeUInt32LE(espCrc32Le(blob), 28);
  sealEntry(blobEntry);

  const payloadStart = ENTRY_TABLE_OFFSET + 2 * ENTRY_SIZE;
  blob.copy(page, payloadStart);

  // entry after the payload: the blob index, which is what a reader looks up
  const indexEntry = entryAt(span + 1);
  indexEntry[0] = namespaceIndex;
  indexEntry[1] = TYPE_BLOB_IDX;
  indexEntry[2] = 1;
  indexEntry[3] = CHUNK_INDEX_NONE;
  writeKey(indexEntry, NVS_KEY);
  indexEntry.writeUInt32LE(blob.length, 24);
  indexEntry[28] = 1; // chunk count
  indexEntry[29] = 0; // chunk start, matching the chunk index above
  sealEntry(indexEntry);

  markEntries(page, usedEntries);

  return image;
};

export interface NvsBlob {
  namespaceIndex: number;
  key: string;
  data: Buffer;
}

/**
 * Minimal reader for the single chunk blobs this module writes, used to verify
 * generated images. Images rewritten by a running firmware may split a blob
 * into chunks, which this deliberately does not reassemble.
 */
export const readNvsBlob = (image: Buffer, key: string): NvsBlob | null => {
  let best: NvsBlob | null = null;
  let bestSequence = -1;
  for (let pageStart = 0; pageStart + PAGE_SIZE <= image.length; pageStart += PAGE_SIZE) {
    const state = image.readUInt32LE(pageStart);
    if (state !== PAGE_STATE_ACTIVE && state !== 0xfffffffc) {
      continue;
    }
    const sequence = image.readUInt32LE(pageStart + 4);
    for (let i = 0; i < ENTRIES_PER_PAGE; i++) {
      const entry = pageStart + ENTRY_TABLE_OFFSET + i * ENTRY_SIZE;
      if (entry + ENTRY_SIZE > image.length || image[entry] === 0xff) {
        continue;
      }
      const span = image[entry + 2];
      if (image[entry + 1] === TYPE_BLOB_DATA) {
        const entryKey = image.toString('ascii', entry + 8, entry + 24).split('\0')[0];
        const size = image.readUInt16LE(entry + 24);
        const dataStart = entry + ENTRY_SIZE;
        if (entryKey === key && sequence > bestSequence && dataStart + size <= image.length) {
          bestSequence = sequence;
          best = {
            namespaceIndex: image[entry],
            key: entryKey,
            data: image.subarray(dataStart, dataStart + size),
          };
        }
      }
      if (span > 1) {
        i += span - 1;
      }
    }
  }
  return best;
};
