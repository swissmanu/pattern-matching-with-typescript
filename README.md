# Pattern Matching with TypeScript

Pattern matching is a fundamental and powerful building block to many functional programming languages like [Haskell](http://learnyouahaskell.com/syntax-in-functions) or [Scala](http://docs.scala-lang.org/tutorials/tour/pattern-matching.html).



(In case you have never heard anything about pattern matching, think about it like a type safe `switch`  statement on steroids.)

TypeScript (and with that, JavaScript) has no pattern matching functionality built in.

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

