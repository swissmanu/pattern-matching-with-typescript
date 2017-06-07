import { matchYesNoString } from './simple';

describe('Simple Pattern Matcher: YesNoStringPattern', () => {
  it('should match "Yes" Yes', () => {
    const yes = jest.fn();

    matchYesNoString({
      Yes: yes,
      No: () => {},
      Other: () => {}
    })('Yes');

    expect(yes).toHaveBeenCalledTimes(1);
  });

  it('should match "No" with No', () => {
    const no = jest.fn();

    matchYesNoString({
      Yes: () => {},
      No: no,
      Other: () => {}
    })('No');

    expect(no).toHaveBeenCalledTimes(1);
  });

  it('should match "🤖" with Other("🤖")', () => {
    const other = jest.fn();

    matchYesNoString({
      Yes: () => {},
      No: () => {},
      Other: other
    })('🤖');

    expect(other).toHaveBeenCalledWith('🤖');
  });
});
