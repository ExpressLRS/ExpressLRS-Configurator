/*
  Target names end up on the PlatformIO command line (--environment) and in
  temporary directory names, so only allow the characters real targets use,
  e.g. "DIY_2400_TX_ESP32_SX1280_E28_via_UART" or "Unified_ESP32_900_RX.via_WIFI".
  The first character must be alphanumeric so a target can't be mistaken for a CLI flag.
 */
const TARGET_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;

export const isValidTargetName = (target: unknown): target is string =>
  typeof target === 'string' && TARGET_NAME_PATTERN.test(target);

export const assertValidTargetName = (target: unknown): string => {
  if (!isValidTargetName(target)) {
    throw new Error(`invalid target name: ${JSON.stringify(target)}`);
  }
  return target;
};
