export type Pet = Dog | Bird;

interface PetPattern<T> {
  Dog: (d: Dog) => T;
  Bird: (b: Bird) => T;
}

interface PetMatcher {
  match<T>(p: PetPattern<T>): T
}

export class Dog implements PetMatcher {
  bark: () => void;

  public match<T>(p: PetPattern<T>): T {
    return p.Dog(this);
  }
}

export class Bird implements PetMatcher {
  chirp: () => void;

  public match<T>(p: PetPattern<T>): T {
    return p.Bird(this);
  }
}
