export type Optional<T> = Some<T> | None<T>;

interface OptionalPattern<T> {
  Some: (d: T) => T;
  None: () => T;
}

interface OptionalMatcher {
  match<T>(p: OptionalPattern<T>): T;
}

export class Some<T> implements OptionalMatcher {
  constructor(private readonly value: T) {}

  match(p: OptionalPattern<T>): T {
    return p.Some(this.value);
  }
}

export class None<T> implements OptionalMatcher {
  match(p: OptionalPattern<T>): T {
    return p.None();
  }
}
