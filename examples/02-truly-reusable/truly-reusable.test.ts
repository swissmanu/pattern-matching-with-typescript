import { matchNumber } from './truly-reusable';

const isLargerThanThree = matchNumber({
  One: () => false,
  Two: () => false,
  Three: () => false,
  Other: n => n > 3
});

describe('Truly Reusable: NumberPattern', () => {
  it('should return false for 0', () => {
    expect(isLargerThanThree(0)).toBe(false);
  });

  it('should return false for 1', () => {
    expect(isLargerThanThree(1)).toBe(false);
  });

  it('should return true for 4', () => {
    expect(isLargerThanThree(4)).toBe(true);
  });
});
