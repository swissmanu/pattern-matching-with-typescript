import { Argument, matchArgument } from './union-types';

describe('Union Types: ArgumentPattern', () => {
  it('should match a string with String(string)', () => {
    const argument: Argument = 'Hello World.';
    const stringSpy = jest.fn();
    const booleanSpy = jest.fn();
    const numberSpy = jest.fn();

    matchArgument({
      String: stringSpy,
      Boolean: booleanSpy,
      Number: numberSpy
    })(argument);

    expect(stringSpy).toHaveBeenCalledWith(argument);
    expect(booleanSpy).not.toHaveBeenCalled();
    expect(numberSpy).not.toHaveBeenCalled();
  });

  it('should match a boolean with Boolean(boolean)', () => {
    const argument: Argument = true;
    const stringSpy = jest.fn();
    const booleanSpy = jest.fn();
    const numberSpy = jest.fn();

    matchArgument({
      String: stringSpy,
      Boolean: booleanSpy,
      Number: numberSpy
    })(argument);

    expect(stringSpy).not.toHaveBeenCalled();
    expect(booleanSpy).toHaveBeenCalledWith(argument);
    expect(numberSpy).not.toHaveBeenCalled();
  });

  it('should match null with Null()', () => {
    const argument: Argument = 42;
    const stringSpy = jest.fn();
    const booleanSpy = jest.fn();
    const numberSpy = jest.fn();

    matchArgument({
      String: stringSpy,
      Boolean: booleanSpy,
      Number: numberSpy
    })(argument);

    expect(stringSpy).not.toHaveBeenCalled();
    expect(booleanSpy).not.toHaveBeenCalled();
    expect(numberSpy).toHaveBeenCalledWith(argument);
  });

  it('should throw an error when trying to match undefined', () => {
    const argument: Argument = undefined;
    const stringSpy = jest.fn();
    const booleanSpy = jest.fn();
    const numberSpy = jest.fn();

    expect(() => {
      matchArgument({
        String: stringSpy,
        Boolean: booleanSpy,
        Number: numberSpy
      })(argument);
    }).toThrowErrorMatchingSnapshot();
  });
});
