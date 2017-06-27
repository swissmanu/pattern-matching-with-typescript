export type Maybe<T> = Just<T> | Nothing<T>;

interface MaybePattern<T> {
  Just: (v: T) => T;
  Nothing: () => T;
}

interface MaybeMatcher {
  match<T>(p: MaybePattern<T>): T;
}

export class Just<T> implements MaybeMatcher {
  constructor(private readonly value: T) {}

  match(p: MaybePattern<T>): T {
    return p.Just(this.value);
  }
}

export class Nothing<T> implements MaybeMatcher {
  match(p: MaybePattern<T>): T {
    return p.Nothing();
  }
}
