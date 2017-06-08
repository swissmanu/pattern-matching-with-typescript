import {Bird, Dog, Pet} from './union-types';
const noop = () => {};

describe('UnionTypes: PetPattern', () => {
  it('should match a Dog with Dog(dog)', () => {
    const dogSpy = jest.fn();
    const birdSpy = jest.fn();
    const pet: Pet = new Dog();

    pet.match({
      Dog: dogSpy,
      Bird: birdSpy
    });

    expect(dogSpy).toHaveBeenCalledWith(pet);
    expect(birdSpy).not.toHaveBeenCalledWith(pet);
  });

  it('should match a Bird with Bird(bird)', () => {
    const dogSpy = jest.fn();
    const birdSpy = jest.fn();
    const pet: Pet = new Bird();

    pet.match({
      Dog: dogSpy,
      Bird: birdSpy
    });

    expect(dogSpy).not.toHaveBeenCalledWith(pet);
    expect(birdSpy).toHaveBeenCalledWith(pet);
  });
});
