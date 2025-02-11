---
sidebar_position: 3
slug: /core-blocks/runners/
---

# Runners

Execute your properties.

## assert

Probably the most useful of all the runners provided within fast-check. This runner takes a property and executes it. It throws automatically in case of failure. Thrown error is formatted to make it easily readable and actionable for the user.

Its signature can be summarized by:

```ts
function assert<Ts>(property: IProperty<Ts>, params?: Parameters<Ts>): void;
function assert<Ts>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>): Promise<void>;
```

:::tip
Check [`Parameters`](https://fast-check.dev/api-reference/interfaces/Parameters.html) to run `assert` with advanced options.
:::

Resources: [API reference](https://fast-check.dev/api-reference/functions/assert.html).  
Available since 0.0.1.

## check

Similar to `assert` except that caller is responsible to handle the output.

In terms of signatures, `check` provides the following:

```ts
function check<Ts>(property: IProperty<Ts>, params?: Parameters<Ts>): RunDetails<Ts>;
function check<Ts>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>): Promise<RunDetails<Ts>>;
```

The structure `RunDetails` provides all the details needed to report what happened. There are four major reasons for `check` to end:

| Reasons                                                 | `failed` | `interrupted`  | `counterexample`/`counterexamplePath`/`error` |
| ------------------------------------------------------- | :------: | :------------: | :-------------------------------------------: |
| failure of the predicate                                |  `true`  | `true`/`false` |                  _not null_                   |
| too many pre-conditions failures                        |  `true`  |    `false`     |                    `null`                     |
| execution took too long given `interruptAfterTimeLimit` |  `true`  |     `true`     |                    `null`                     |
| successful run                                          | `false`  | `true`/`false` |                    `null`                     |

:::tip Rewrite `assert` with `check`

```js
function assert(property, params) {
  // In this example we only support synchronous properties.
  // To support both of them, you could use `property.isAsync()` and `asyncDefaultReportMessage`.
  const out = fc.check(property, params);
  if (out.failed) {
    throw new Error(fc.defaultReportMessage(out), { cause: out.errorInstance });
  }
}
```

:::

Resources: [API reference](https://fast-check.dev/api-reference/functions/check.html).  
Available since 0.0.1.

## sample

Certainly one of the most useful when attempting to create your own arbitraries. `sample` gives you a way to extract very quickly what would be the values generated by your arbitrary.

Its signature is:

```ts
function sample<Ts>(generator: IRawProperty<Ts, boolean> | Arbitrary<Ts>, params?: number | Parameters<Ts>): Ts[];
```

Resources: [API reference](https://fast-check.dev/api-reference/functions/sample.html).  
Available since 0.0.6.

## statistics

When building a new arbitrary, knowing what would be the generated values is a thing but checking how well they cover the range of possible values is also crucial in some cases. `statistics` can be seen as a refinement over `sample`. It helps users to properly design their own arbitraries and check how efficient they will be.

Its signature is:

```ts
function statistics<Ts>(
  generator: IRawProperty<Ts, boolean> | Arbitrary<Ts>,
  classify: (v: Ts) => string | string[],
  params?: number | Parameters<Ts>
): void;
```

Example of usage:

```js
fc.statistics(
  fc.string(), // source arbitrary
  (v) => `${v.length} characters`, // classifier
  { numRuns: 100_000 } // extra parameters
);
// Possible output:
// >  0 characters...9.65%
// >  2 characters...9.56%
// >  1 characters...9.41%
// >  3 characters...9.30%
// >  6 characters...9.04%
// >  9 characters...8.92%
// >  7 characters...8.90%
// >  8 characters...8.90%
// >  10 characters..8.86%
// >  4 characters...8.79%
// >  5 characters...8.68%
```

Resources: [API reference](https://fast-check.dev/api-reference/functions/statistics.html).  
Available since 0.0.6.
