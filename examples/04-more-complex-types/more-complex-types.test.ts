import { Just, Nothing, Maybe } from './more-complex-types';
const noop = () => {};

describe('More Complex Types: MaybePattern', () => {
  it('should match a Just with Just(value)', () => {
    const justSpy = jest.fn();
    const nothingSpy = jest.fn();
    const value = 'I have a value';
    const maybe: Maybe<string> = new Just(value);

    maybe.match({
      Just: justSpy,
      Nothing: nothingSpy
    });

    expect(justSpy).toHaveBeenCalledWith(value);
    expect(nothingSpy).not.toHaveBeenCalled();
  });

  it('should match a Nothing with Nothing()', () => {
    const justSpy = jest.fn();
    const nothingSpy = jest.fn();
    const maybe: Maybe<string> = new Nothing<string>();

    maybe.match({
      Just: justSpy,
      Nothing: nothingSpy
    });

    expect(justSpy).not.toHaveBeenCalled();
    expect(nothingSpy).toHaveBeenCalled();
  });
});
