/**
 * The options block that binary_configurator.py writes into a firmware binary.
 * It holds the UID derived from the binding phrase and the flash discriminator,
 * both of which the generated configuration has to carry so the firmware does
 * not overwrite it on the first boot.
 */

export interface FirmwareOptions {
  uid?: number[];
  flashDiscriminator?: number;
}

export const readFirmwareOptions = (firmware: Buffer): FirmwareOptions | null => {
  // the block is plain json embedded in the binary; the marker can also show
  // up in string literals of the firmware itself, so every match is tried
  const text = firmware.toString('latin1');
  const matches = text.matchAll(/\{[^{}]*"flash-discriminator"[^{}]*\}/g);
  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[0]);
      const uid = Array.isArray(parsed.uid)
        ? parsed.uid.map((value: unknown) => Number(value) & 0xff)
        : undefined;
      const flashDiscriminator
        = typeof parsed['flash-discriminator'] === 'number'
          ? parsed['flash-discriminator'] >>> 0
          : undefined;
      if (uid !== undefined && uid.length !== 6) {
        return { flashDiscriminator };
      }
      return { uid, flashDiscriminator };
    } catch {
      // not the options block, keep looking
    }
  }
  return null;
};
