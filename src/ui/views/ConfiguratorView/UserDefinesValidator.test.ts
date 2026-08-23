import UserDefinesValidator from './UserDefinesValidator';
import {
  UserDefine,
  UserDefineKey,
  UserDefineKind,
} from '../../gql/generated/types';

const numeric = (value: string, min?: number, max?: number): UserDefine => ({
  type: UserDefineKind.Number,
  key: UserDefineKey.AUTO_WIFI_ON_INTERVAL,
  enabled: true,
  enumValues: null,
  value,
  min,
  max,
  optionGroup: null,
  sensitive: false,
});

describe('UserDefinesValidator numeric ranges', () => {
  const validator = new UserDefinesValidator();

  it('accepts a value within range', () => {
    expect(validator.validateNumericRanges([numeric('60', 1, 2147483)])).toHaveLength(0);
  });

  it('rejects a value below min (regression: -11111 was accepted)', () => {
    const errs = validator.validateNumericRanges([numeric('-11111', 1, 2147483)]);
    expect(errs).toHaveLength(1);
    expect(errs[0].message).toContain('greater than or equal to 1');
  });

  it('rejects a value above max', () => {
    const errs = validator.validateNumericRanges([numeric('99999999', 1, 2147483)]);
    expect(errs).toHaveLength(1);
    expect(errs[0].message).toContain('less than or equal to 2147483');
  });

  it('rejects a non-integer value', () => {
    expect(validator.validateNumericRanges([numeric('1.5', 1, 2147483)])).toHaveLength(1);
    expect(validator.validateNumericRanges([numeric('abc', 1, 2147483)])).toHaveLength(1);
  });

  it('ignores disabled numeric options', () => {
    const option = { ...numeric('-11111', 1, 2147483), enabled: false };
    expect(validator.validateNumericRanges([option])).toHaveLength(0);
  });

  it('handles a numeric option without bounds', () => {
    expect(validator.validateNumericRanges([numeric('42')])).toHaveLength(0);
  });
});

describe('UserDefinesValidator.validate() gate (blocks build)', () => {
  it('surfaces -11111 through the full validate() gate', () => {
    const errs = new UserDefinesValidator().validate([numeric('-11111', 1, 2147483)]);
    expect(errs.length).toBeGreaterThan(0);
    expect(errs.some((e) => e.message.includes('greater than or equal to 1'))).toBe(true);
  });
  it('lets a valid value pass the full gate', () => {
    expect(new UserDefinesValidator().validate([numeric('60', 1, 2147483)])).toHaveLength(0);
  });
});
