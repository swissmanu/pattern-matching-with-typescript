interface YesNoStringPattern<T> {
  Yes: () => T;
  No: () => T;
  Other: (s: string) => T;
}

export function matchYesNoString<T>(
  p: YesNoStringPattern<T>
): (s: string) => T {
  return (s: string): T => {
    if (s === 'Yes') {
      return p.Yes();
    } else if (s === 'No') {
      return p.No();
    }
    return p.Other(s);
  };
}
