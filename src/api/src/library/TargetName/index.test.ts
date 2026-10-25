import { assertValidTargetName, isValidTargetName } from './index';

describe('isValidTargetName', () => {
  it.each([
    'DIY_2400_TX_ESP32_SX1280_E28_via_UART',
    'Unified_ESP32_900_RX.via_WIFI',
    'Generic-ESP8285-2400',
  ])('accepts %s', (target) => {
    expect(isValidTargetName(target)).toBe(true);
  });

  it.each([
    '',
    'INVALID & whoami > "%TEMP%\\marker" & rem',
    'INVALID; id',
    'INVALID | id',
    'INVALID$(id)',
    'INVALID`id`',
    'INVALID\nid',
    'with space',
    '../../etc',
    '-x',
    '--project-dir',
  ])('rejects %j', (target) => {
    expect(isValidTargetName(target)).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isValidTargetName(undefined)).toBe(false);
    expect(isValidTargetName(null)).toBe(false);
    expect(isValidTargetName(42)).toBe(false);
  });
});

describe('assertValidTargetName', () => {
  it('returns valid target names', () => {
    expect(assertValidTargetName('DIY_2400_TX_ESP32_SX1280_E28_via_UART')).toBe(
      'DIY_2400_TX_ESP32_SX1280_E28_via_UART',
    );
  });

  it('throws on invalid target names', () => {
    expect(() => assertValidTargetName('x & whoami')).toThrow(
      'invalid target name',
    );
  });
});
