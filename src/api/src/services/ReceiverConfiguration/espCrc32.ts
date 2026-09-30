/**
 * CRC-32 as implemented by the ESP32 ROM function esp_crc32_le, which NVS uses
 * for its page headers, entry headers and blob data.
 *
 * It is the standard reflected CRC-32 (polynomial 0xEDB88320), but the ROM
 * inverts the seed on the way in and the result on the way out, so seeding it
 * with 0xFFFFFFFF makes the accumulator start at zero.
 */
const table = ((): Uint32Array => {
  const result = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) === 1 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : c >>> 1;
    }
    result[n] = c >>> 0;
  }
  return result;
})();

export default function espCrc32Le(data: Buffer, seed = 0xffffffff): number {
  let crc = ~seed >>> 0;
  for (let i = 0; i < data.length; i++) {
    crc = (table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  }
  return ~crc >>> 0;
}
