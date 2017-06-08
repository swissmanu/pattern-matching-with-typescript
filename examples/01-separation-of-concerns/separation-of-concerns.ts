interface NumberPattern {
  One: () => string;
  Two: () => string;
  Three: () => string;
  Other: (n: number) => string;
}

export function matchNumber(p: NumberPattern): (n: number) => string {
  return (n: number): string => {
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
