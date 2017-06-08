interface PetPattern<T> {
  Dog: (d: Dog) => T;
  Bird: (b: Bird) => T;
}

export abstract class Pet {
  public abstract match<T>(p: PetPattern<T>): T;
}

export class Dog extends Pet {
  bark: () => void;

  public match<T>(p: PetPattern<T>): T {
    return p.Dog(this);
  }
}

export class Bird extends Pet {
  chirp: () => void;

  public match<T>(p: PetPattern<T>): T {
    return p.Bird(this);
  }
}
