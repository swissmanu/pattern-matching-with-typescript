export function matchNumber(n: number): string {
  switch (n) {
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    default:
      return `${n}`;
  }
}
