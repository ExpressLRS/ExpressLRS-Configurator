import crypto from 'crypto';

/**
 * The UID a binding phrase results in, mirroring generateUID() of
 * binary_configurator.py. The generated configuration has to carry the same UID
 * the firmware was built with, otherwise the receiver replaces it on first boot.
 *
 * A phrase of four to six comma separated byte values is taken literally,
 * anything else is hashed.
 */
export const generateUid = (phrase: string): number[] => {
  const parts = phrase.split(',');
  const numbers = parts.map((item) =>
    /^\d+$/.test(item) ? Number.parseInt(item, 10) : -1,
  );
  const isLiteral = numbers.length >= 4
    && numbers.length <= 6
    && numbers.every((value) => value >= 0 && value < 256);
  if (isLiteral) {
    // only four bytes are needed to bind, the rest is padded in front
    return [...new Array(6 - numbers.length).fill(0), ...numbers];
  }
  const hash = crypto
    .createHash('md5')
    .update(`-DMY_BINDING_PHRASE="${phrase}"`)
    .digest();
  return [...hash.subarray(0, 6)];
};

export default generateUid;
