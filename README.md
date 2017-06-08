# Pattern Matching with TypeScript

TypeScript does not have any pattern matching functionality built in. This article shows several ways how you can replicate the core of a simple pattern matcher using a few simple structures and functions within TypeScript.

Done right, resulting code will have improved maintainability and better runtime type safety.

## What is Pattern Matching?

Pattern matching is a fundamental and powerful building block to many functional programming languages like [Haskell](http://learnyouahaskell.com/syntax-in-functions) or [Scala](http://docs.scala-lang.org/tutorials/tour/pattern-matching.html).

A *pattern* can contain one or more *cases*. Each *case* describes *behaviour* which has to be applied once the *case* matches.

You might think: "Hey! That sounds like a `switch` statement to me!". And you are right indeed:

```typescript
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

export function randomNumber(): number {
  return Math.floor(Math.random() * (10 - 1) + 1); // Random number 1...10
}

console.log(matchNumber(randomNumber()));
```

We can use a `switch` statement to map `number`s to its desired `string` representation.

This approach has drawbacks:

* The *behaviour* for each case is baked into the `matchNumber` function. If you want to map `number`s to, lets say `boolean`s, you have to reimplement the complete `switch` block.
* ​









## Boolean Pattern

Following code introduces an interface containing cases to handle possible values of the `boolean` type. Each case is a function which will return a `T`.

```typescript
interface BooleanPattern<T> {
  True: () => T,
  False: () => T
}
```

The `BooleanPattern` allows us to describe specific behaviours for each possible case.

Following `matchBoolean` function takes such behaviour description and returns a matcher. function which then will execute the *matching* case by

```typescript
function matchBoolean<T>(p: BooleanPattern): (b: boolean) => T {
  return (b: boolean) => {
    if (b) {
      return p.True();
    }
    return p.False();
  }
}
```

This could be used:

```typescript
const loggedIn: boolean = await isUserLoggedIn();
const result = matchBoolean({
  True: () => 'User is logged in',
  False: () => 'User is logged out'
})(loggedIn);
```

