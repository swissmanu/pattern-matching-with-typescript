# Pattern Matching with TypeScript





## Simple Draft with TypeScript

```typescript
interface YesNoStringPattern {
  Yes: () => T,
  No: () => T,
  Other: (s: string) => T,  
}

function matchYesNoString<T>(p: YesNoP)
```

