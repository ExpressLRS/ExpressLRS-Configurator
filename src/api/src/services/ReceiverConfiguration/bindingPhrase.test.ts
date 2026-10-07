import { generateUid } from './bindingPhrase';

describe('generateUid', () => {
  it('hashes a spoken phrase', () => {
    // md5 of -DMY_BINDING_PHRASE="hello world", first six bytes
    expect(generateUid('hello world')).toEqual([
      0xae, 0x86, 0x44, 0x86, 0x0f, 0xab,
    ]);
  });

  it('is stable', () => {
    expect(generateUid('my quadcopter')).toEqual(generateUid('my quadcopter'));
  });

  it('gives different phrases different uids', () => {
    expect(generateUid('one')).not.toEqual(generateUid('two'));
  });

  it('takes a list of byte values literally and pads it in front', () => {
    expect(generateUid('1,2,3,4')).toEqual([0, 0, 1, 2, 3, 4]);
    expect(generateUid('1,2,3,4,5,6')).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('hashes lists that are not plain bytes', () => {
    expect(generateUid('1,2,3')).not.toEqual([0, 0, 0, 1, 2, 3]);
    expect(generateUid('1,2,3,300')).toHaveLength(6);
    expect(generateUid('1,2,3,abc')).toHaveLength(6);
  });

  it('always returns six bytes', () => {
    ['', 'x', '1,2,3,4,5,6,7'].forEach((phrase) => {
      expect(generateUid(phrase)).toHaveLength(6);
    });
  });
});
