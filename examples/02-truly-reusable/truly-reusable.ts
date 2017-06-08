interface NumberPattern<T> {
  One: () => T;
  Two: () => T;
  Three: () => T;
  Other: (n: number) => T;
}

export function matchNumber<T>(p: NumberPattern<T>): (n: number) => T {
  return (n: number): T => {
    switch (n) {
      case 1:
        return p.One();
      case 2:
        return p.Two();
      case 3:
        return p.Three();
      default:
        return p.Other(n);
    }
  };
}
