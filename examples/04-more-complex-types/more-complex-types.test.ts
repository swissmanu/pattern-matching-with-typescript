import { Some, None, Optional } from './more-complex-types';
const noop = () => {};

describe('More Complex Types: OptionalPattern', () => {
  it('should match a Some with Some(value)', () => {
    const someSpy = jest.fn();
    const noneSpy = jest.fn();
    const value = 'I have a value';
    const optional: Optional<string> = new Some(value);

    optional.match({
      Some: someSpy,
      None: noneSpy
    });

    expect(someSpy).toHaveBeenCalledWith(value);
    expect(noneSpy).not.toHaveBeenCalled();
  });

  it('should match a None with None()', () => {
    const someSpy = jest.fn();
    const noneSpy = jest.fn();
    const optional: Optional<string> = new None<string>();

    optional.match({
      Some: someSpy,
      None: noneSpy
    });

    expect(someSpy).not.toHaveBeenCalled();
    expect(noneSpy).toHaveBeenCalled();
  });
});
