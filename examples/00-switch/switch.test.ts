import { matchNumber } from './switch';

describe('switch: matchNumber', () => {
  it('should match 0 with "0"', () => {
    expect(matchNumber(0)).toBe('0');
  });

  it('should match 1 with "one"', () => {
    expect(matchNumber(1)).toBe('one');
  });

  it('should match 2 with "two"', () => {
    expect(matchNumber(2)).toBe('two');
  });

  it('should match 3 with "two"', () => {
    expect(matchNumber(3)).toBe('three');
  });

  it('should match 4 with "4"', () => {
    expect(matchNumber(4)).toBe('4');
  });
});
