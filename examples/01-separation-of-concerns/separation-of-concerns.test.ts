import { matchNumber } from './separation-of-concerns';
const noop = () => '';

describe('Separation of Concerns: NumberPattern', () => {
  it('should match 0 with Other(0)', () => {
    const spy = jest.fn();
    const match = matchNumber({
      One: noop,
      Two: noop,
      Three: noop,
      Other: spy
    });

    match(0);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should match 1 with One', () => {
    const spy = jest.fn();
    const match = matchNumber({
      One: spy,
      Two: noop,
      Three: noop,
      Other: noop
    });

    match(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should match 2 with Two', () => {
    const spy = jest.fn();
    const match = matchNumber({
      One: noop,
      Two: spy,
      Three: noop,
      Other: noop
    });

    match(2);
    expect(spy).toHaveBeenCalled();
  });

  it('should match 3 with Three', () => {
    const spy = jest.fn();
    const match = matchNumber({
      One: noop,
      Two: noop,
      Three: spy,
      Other: noop
    });

    match(3);
    expect(spy).toHaveBeenCalled();
  });
});
