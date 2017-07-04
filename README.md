# Pattern Matching with TypeScript

// TODO Pretty Intro Image

[TypeScript](https://www.typescriptlang.org/index.html) does not have any pattern matching functionality built in. This article shows several ways how you can replicate the core of a simple pattern matcher using a few simple structures and functions within TypeScript.

Resulting code will have improved maintainability and better runtime type safety when done right.

## What is Pattern Matching?

Pattern matching is a fundamental and powerful building block to many functional programming languages like [Haskell](http://learnyouahaskell.com/syntax-in-functions) or [Scala](http://docs.scala-lang.org/tutorials/tour/pattern-matching.html).

We will not be able to replicate pattern matching on the level of sophistication as those languages provide. Though we can reuse the fundamental approach of pattern matching as inspiration to build something helpful in TypeScript.

Essentially a *pattern* can be defined as a thing describing one or more *cases*. Each *case* itself represents a specific *behavior* which has to be applied once the *case* matches.

You might think: *"Hey! That sounds like a `switch` statement to me!"*. And you are right indeed:

## Match with Switch Statement

```typescript
function matchNumber(n: number): string {
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

function randomNumber(): number {
  return Math.floor(Math.random() * (10 - 1) + 1); // Random number 1...10
}

const result = matchNumber(randomNumber()); // result === One, Two, Three or 4...10
```

We can use a `switch` statement to map `number`s to its desired `string` representation.

Doing so is straightforward, but we can make out flaws for `matchNumber`:

1. The *behavior* for each case is baked into the `matchNumber` function. You have to reimplement the complete `switch` block if you want to map to something else than a `string`, for example, a `boolean`.
2. Functional requirements can be misinterpreted and behavior for a case gets lost. What about `4`? What if a developer forgets about `default`?
   The possibility of bugs multiplies easily when the `switch` is reimplemented several times as described under point 1.

These flaws can be translated into a set of characteristics for a solution:

1. Separate matching a specific *case* from its *behavior*
2. Make reuse of matcher simple to prevent bugs through duplicated code
3. Implement matcher once for different types

## Separation of Concerns

Let's define an interface containing functions for each *case* we want to be able to match. This allows separating behavior from actual matcher logic later.

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
function matchNumber(p: NumberPattern): (n: number) => string {
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

The new implementation consumes a `NumberPattern`. It returns a function which uses our `switch` block from before with an important difference: It does no longer map a `number` to a `string` on its own, it delegates that job to the pattern initially given to `matchNumber`.

Applying `NumberPattern` and the new `matchNumber`  to the task from the previous section results in the following code:

```typescript
const match = matchNumber({
  One: () => 'One',
  Two: () => 'Two',
  Three: () => 'Three',
  Other: (n) => `${n}`
});

const result = match(randomNumber());  // result === One, Two, Three or 4...10
```

We clearly separated *case behaviors* from the matcher. That first point can be ticked off. Does it further duplicating code and improve maintainability of the matcher?

```typescript
const matchGerman = matchNumber({
  One: () => 'Eins',
  Two: () => 'Zwei',
  Three: () => 'Drei',
  Other: (n) => `${n}`
});

const result = matchGerman(randomNumber());  // result === Eins, Zwei, Drei or 4...10
```

Another tick! Because we have split concerns by introducing `NumberPattern`, changing behavior without reimplementing the underlying matcher logic is straightforward.

## Truly Reusable

Map a `number` to something different than a `string` still needs reimplementation of `matchNumber`. Can we solve this without doing so for each target type over and over again? Sure! [Generics](https://www.typescriptlang.org/docs/handbook/generics.html) provide an elegant solution:

```typescript
interface NumberPattern<T> {
  One: () => T;
  Two: () => T;
  Three: () => T;
  Other: (n: number) => T;
}

function matchNumber<T>(p: NumberPattern<T>): (n: number) => T {
  return (n: number): T => {
    // ...
  };
}
```

Introducing the generic type parameter `T` makes `NumberPattern` and `matchNumber` truly reusable: It can map a `number` to any other type now. For example a `boolean`:

```typescript
const isLargerThanThree = matchNumber({
  One: () => false,
  Two: () => false,
  Three: () => false,
  Other: n => n > 3
});

const is100Larger = isLargerThanThree(100); // is100Larger === true
const is1Larger = isLargerThanThree(1); // is1Larger === false
```

This fulfills the last point in our requirement list to implement the matcher once for different types. The final example will probably never make it to production code but it demonstrates the basic mechanic how a pattern and a corresponding matcher can be implemented in TypeScript.

## Match Union Types

[Union types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) are a convenient way to model more sophisticated types. Knowing what specific type you are handling can be tedious though:

```typescript
type Argument = string | boolean;

const a = 'Hello World';

if (typeof a === 'string') {
  // do string stuff
} else if (typeof a === 'boolean') {
  // do boolean stuff
}
```

Let's assume I am lazy and desperately need that `if` block somewhere else too. I simply copy-and-paste the block and introduce successfully the first part of maintenance hell:

A new requirement wants me to allow `number`s as an argument in the application, so I modify the type definition of `Argument` accordingly and update *one* of the `if` blocks (because I already forgot about its twin):

```typescript
type Argument = string | boolean | number;

// ...
} else if (typeof a === 'number') {
  // do number stuff
}
```

The duplicated code with different type handling for `Argument` bears huge potential for runtime errors and undiscovered bugs.

With the pattern matcher from the section before we already know a handy tool to defuse this situation. The  `ArgumentPattern` describes all possible *cases* when handling an `Argument` and the `matchArgument` matcher encapsulates the cumbersome code and makes it reusable:

```typescript
interface ArgumentPattern<T> {
  String: (s: string) => T;
  Boolean: (b: boolean) => T;
  Number: (n: number) => T;
}

function matchArgument<T>(p: ArgumentPattern<T>): (a: Argument) => T {
  return (a: Argument): T => {
    if (typeof a === 'string') {
      return p.String(a);
    } else if (typeof a === 'boolean') {
      return p.Boolean(a);
    } else if (typeof a === 'number') {
      return p.Number(a);
    }

    throw new Error(`matchArgument: Could not match type ${typeof a}`);
  };
}

const aString = 'Hello World';
const result = matchArgument({
  String: (s) => console.log(`A string: ${s}`),
  Boolean: (b) => console.log(`A boolean: ${b}`),
  Number: (n) => console.log(`A number: ${n}`)
})(aString);  // result === "A string: Hello World"
```

The big advantage of this solution plays once I have to modify the `Argument` type again: I Simply adapt  `ArgumentPattern` accordingly and TypeScript will light up all code occurrences where action needs to be taken. A consistent evaluation of a union type becomes much easier this way.

## Real Life Problem Domain

Following final example takes techniques introduced earlier and applies them to a more real live alike problem domain. An imaginative cash register application provides different ways how a customer can pay his bill. This requirement is modelled using the `Payment` type and two specializations `CreditCardPayment` and `CashPayment`. A `PaymentPattern` interface is implemented along with those types:

```typescript
interface PaymentPattern<T> {
  CreditCard: (card: CreditCardPayment) => T;
  Cash: (cash: CashPayment) => T;
}

interface PaymentMatcher {
  match<T>(p: PaymentPattern<T>): T;
}

abstract class Payment implements PaymentMatcher {
  constructor(public readonly amount: number) {}
  abstract match<T>(p: PaymentPattern<T>): T;
}

class CreditCardPayment extends Payment {
  constructor(amount: number, public readonly fee: number) {
    super(amount);
  }

  match<T>(p: PaymentPattern<T>): T {
    return p.CreditCard(this);
  }
}

class CashPayment extends Payment {
  constructor(amount: number, public readonly discount: number) {
    super(amount);
  }

  match<T>(p: PaymentPattern<T>): T {
    return p.Cash(this);
  }
}
```

You may notice the absence of a distinct `matchPayment` function when comparing to former examples. This slightly different approach uses a `PaymentMatcher` interface and a pinch of polymorphism magic instead.

Doing so prevents a set of cumbersome and potentially harmful `instanceof` compares by baking `PaymentMatcher` into the abstract `Payment` base type. Each specialized payment implements `PaymentMatcher.match` then on its own.

The matcher function is called on the concrete type now. `calculatePaymentAmount` showcases this by applying different calculation strategies depending on what kind of payment is processed:

```typescript
function calculatePaymentAmount(payment: Payment) {
  return payment.match({
    CreditCard: (card) => card.amount + (card.amount * card.fee),
    Cash: (cash) => cash.amount - cash.discount
  });
}

const creditCardPayment = new CreditCardPayment(100, 0.02);
const creditCardAmount = calculatePaymentAmount(creditCardPayment);
// creditCardAmount === 102

const cashPayment = new CashPayment(100, 2);
const cashAmount = calculatePaymentAmount(cashPayment);
// cashPayment === 98
```

An obvious extension might be the introduction of an additional payment type or the change of an existing calculation strategy. Each of those are nicely secured by compile time checks which help to minimize the potential for new bugs.

## Conclusion

The presented solution to bring pattern matching to TypeScript based applications is a powerful way to keep growing code bases better maintainable. It is a tool to keep code duplication low and keep conditions separated from actual behavior. Better readable code is an additional side effect.

I do work with these paradigms for quite some time up to today. After writing this article one thing is even more clear to me than before: To replicate pattern matching for a language like TypeScript means to introduce a lot of boilerplate code. And indeed this boilerplate can be overkill for small, simple applications.

My personal experience proofs for myself that exactly this boilerplate can help to mitigate risks and potential bugs as a code base grows, developers hop on and off and requirements increase in their complexity.

Similar to other ways of structuring code, pattern matching is no silver bullet either. Have it in your toolbox and apply it with care when the situation seems reasonable.

## Credits

> A huge "thank you" goes to [@dbrack](https://github.com/dbrack) and [@mweibel](https://github.com/mweibel) for proofreading and reviewing this article during its making. Thanks guys! ❤️