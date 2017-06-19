export type Argument = string | boolean | number;

interface ArgumentPattern<T> {
  String: (s: string) => T;
  Boolean: (b: boolean) => T;
  Number: (n: number) => T;
}

export function matchArgument<T>(p: ArgumentPattern<T>): (a: Argument) => T {
  return (a: Argument): T => {
    if (typeof a === 'string') {
      return p.String(a);
    } else if (typeof a === 'boolean') {
      return p.Boolean(a);
    } else if (typeof a === 'number') {
      return p.Number(a);
    }

    throw new Error(`matchArgument: Could not match type ${typeof a}`);
  };
}
