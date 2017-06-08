# Pattern Matching with TypeScript

TypeScript does not have any pattern matching functionality built in. This article shows several ways how you can replicate the core of a simple pattern matcher using a few simple structures and functions within TypeScript.

Done right, resulting code will have improved maintainability and better runtime type safety.

## What is Pattern Matching?

Pattern matching is a fundamental and powerful building block to many functional programming languages like [Haskell](http://learnyouahaskell.com/syntax-in-functions) or [Scala](http://docs.scala-lang.org/tutorials/tour/pattern-matching.html).

*TODO: Disclaimer: Language-Level Pattern matchers go further than what we build here… Though its a nice abstraction pattern to improve code maintainability*

A *pattern* can contain one or more *cases*. Each *case* describes *behaviour* which has to be applied once the *case* matches.

You might think: *"Hey! That sounds like a `switch` statement to me!"*. And you are right indeed:

## Match with Switch Statement

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

Doing so is straight forward, though we can make out flaws for `matchNumber`:

1. The *behaviour* for each case is baked into the `matchNumber` function. If you want to map `number`s to, lets say `boolean`s, you have to reimplement the complete `switch` block in another function.` 
2. Requirements can be misinterpreted and behaviour for a case gets lost. What about `4`? What if a developer forgets about `default`?
   The possibility of bugs multiplies easily when the `switch` is reimplemented several times as described under point 1.

Trying to solve these flaws outlines requirements for an improved solution:

1. Separate matching a specific *case* from its *behaviour*
2. Make reuse of matcher simple to prevent bugs through duplicated code
3. Implement matcher once

## Separation of Concerns

Lets define an interface containing functions for each *case* we want be able to match. This allows to separate behaviour from actual matcher logic later.

```typescript
interface NumberPattern {
  One: () => string;
  Two: () => string;
  Three: () => string;
  Other: (n: number) => string;
}
```

Having `NumberPattern`, we can rebuild `matchNumber`:

```typescript
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
```

The new implementation consumes a `NumberPattern`. It returns a function which uses our `switch` block from before with an important difference: It does not map a `number` to a `string` on its own, it defers that job to the pattern initially given to `matchNumber`.

Applying `NumberPattern` and the new `matchNumber` iteration to the example from the previous section results in the following code:

```typescript
const match = matchNumber({
  One: () => 'One',
  Two: () => 'Two',
  Three: () => 'Three',
  Other: (n) => `${n}`
});

console.log(match(randomNumber()))
```

We clearly separated *case behaviours* from the matcher, so that first point can be ticked off. What preventing duplicate code and with that, improving maintainability of the matcher logic?

```typescript
const matchGerman = matchNumber({
  One: () => 'Eins',
  Two: () => 'Zwei',
  Three: () => 'Drei',
  Other: (n) => `${n}`
});

console.log(matchGerman(randomNumber()))
```

Another tick! Because we have split concerns by introducing `NumberPattern`, changing behaviour without reimplementing the underlying matcher logic is straight forward.


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

