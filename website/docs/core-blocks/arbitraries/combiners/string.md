---
slug: /core-blocks/arbitraries/combiners/string/
---

# String

Combine and enhance existing string arbitraries.

## stringOf

String containing characters produced by the passed character generator.

**Signatures:**

- `fc.stringOf(charArb)`
- `fc.stringOf(charArb, {minLength?, maxLength?, size?})`

**with:**

- `charArb` — _arbitrary able to generate random strings (possibly multiple characters)_
- `minLength?` — default: `0` — _minimal number of characters (included)_
- `maxLength?` — default: `0x7fffffff` [more](/docs/configuration/larger-entries-by-default/#size-explained) — _maximal number of characters (included)_
- `size?` — default: `undefined` [more](/docs/configuration/larger-entries-by-default/#size-explained) — _how large should the generated values be?_

**Usages:**

```js
fc.stringOf(fc.hexa());
// Examples of generated values: "f312", "ab286", "6e1a5", "5e3", "9"…

fc.stringOf(fc.char(), { maxLength: 3 });
// Note: Any string containing up to 3 (included) characters extracted from `fc.char()`
// Examples of generated values: "", "W|", "J&", "x#", "\""…

fc.stringOf(fc.char(), { minLength: 4, maxLength: 6 });
// Note: Any string containing between 4 (included) and 6 (included) characters extracted from `fc.char()`
// Examples of generated values: "j1,p{h", "[~%?", "&alf", "call!", "\"&S \"!"…

fc.stringOf(fc.constantFrom('a', 'b'), { maxLength: 5 });
// Note: Any string containing between 0 (included) and 5 (included) characters extracted from `fc.constantFrom('a', 'b')`
// Examples of generated values: "ba", "bb", "aba", "", "abb"…

fc.stringOf(fc.constantFrom('Hello', 'World'), { minLength: 1, maxLength: 3 });
// Note: It might produce strings like "WorldWorldWorld" or "WorldHelloWorld"…
// Examples of generated values: "Hello", "World", "HelloWorld", "WorldWorldHello", "HelloWorldHello"…
```

Resources: [API reference](https://fast-check.dev/api-reference/functions/stringOf.html).  
Available since 1.1.3.

## stringMatching

String matching the passed regex.

**Signatures:**

- `fc.stringMatching(regex)`
- `fc.stringMatching(regex, {size?})`

**with:**

- `regex` — _the regex to be matched by produced strings_
- `size?` — default: `undefined` [more](/docs/configuration/larger-entries-by-default/#size-explained) — _how large should the generated values be?_

**Usages:**

```js
fc.stringMatching(/\s(html|php|css|java(script)?)\s/);
// Note: The regex does not contain ^ or $ assertions, so extra text could be added before and after the match
// Examples of generated values: "ca\rjava U4", "'Kn7&cP<5:\tjava\n", "<NfX\rcss\r*.", "%\u000bjavascript\fname", "#\u000bcss\u000b`&HpS"…

fc.stringMatching(/^rgb\((?:\d|[1-9]\d|1\d\d|2[0-5]\d),(?:\d|[1-9]\d|1\d\d|2[0-5]\d),(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\)$/);
// Note: Regex matching RGB colors
// Examples of generated values: "rgb(237,6,11)", "rgb(143,160,247)", "rgb(257,213,251)", "rgb(4,185,33)", "rgb(253,230,211)"…

fc.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[12345][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
// Note: Regex matching UUID
// Examples of generated values:
// • "fd606aa1-b53b-1c7b-9e2f-1e2c1ff1b8e9"
// • "e74cec0b-bd5a-4dba-96a9-edbfa9c1a198"
// • "fcccdcf3-908e-5179-adce-7ebae72c12dc"
// • "0eab1fab-5bc2-336c-9ccb-a3fecbe72ee2"
// • "bb3073ee-2283-2538-ba0c-1b976ebb9610"
// • …

fc.stringMatching(
  /^(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)\.(?:\d|[1-9]\d|1\d\d|2[0-5]\d)$/
);
// Note: Regex matching IP v4, we rather recommend you to rely on `fc.ipV4()`
// Examples of generated values: "157.49.38.2", "216.56.226.213", "154.234.230.187", "6.207.244.214", "54.207.15.189"…
```

Resources: [API reference](https://fast-check.dev/api-reference/functions/stringMatching.html).  
Available since 3.10.0.

## mixedCase

Switch the case of characters generated by an underlying arbitrary.

**Signatures:**

- `fc.mixedCase(stringArb)`
- `fc.mixedCase(stringArb, { toggleCase?, untoggleAll? })`

**with:**

- `stringArb` — _arbitrary producing random strings_
- `toggleCase?` — default: _try `toUpperCase` on the received code-point, if no effect try `toLowerCase`_ — _custom toggle case function that will be called on some of the code-points to toggle the character_
- `untoggleAll?` — default: `undefined` — _transform a string containing possibly toggled items to its untoggled version, when provided it makes it possible to shrink user-definable values, otherwise user-definable values will not be shrinkable BUT values generated by the framework will be shrinkable_

**Usages:**

```js
fc.mixedCase(fc.hexaString());
// Examples of generated values: "", "C63", "064", "1e412E00", "0E"…

fc.mixedCase(fc.constant('hello world'));
// Examples of generated values: "HEllO wOrLd", "hElLo WoRLD", "hELlo woRlD", "helLO WOrLd", "HEllo wOrld"…

fc.mixedCase(fc.constant('hello world'), {
  toggleCase: (rawChar) => `UP(${rawChar})`,
  // untoggleAll is optional, we use it in this example to show how to use all the options together
  untoggleAll: (toggledString) => toggleString.replace(/UP\((.)\)/g, '$1'),
});
// Examples of generated values:
// • "UP(h)elUP(l)o UP(w)UP(o)rUP(l)UP(d)"
// • "UP(h)eUP(l)UP(l)UP(o) UP(w)oUP(r)UP(l)UP(d)"
// • "UP(h)UP(e)lUP(l)UP(o)UP( )UP(w)UP(o)UP(r)ld"
// • "UP(h)elUP(l)oUP( )UP(w)orUP(l)UP(d)"
// • "helUP(l)o UP(w)orlUP(d)"
// • …

fc.mixedCase(fc.constant('🐱🐢🐱🐢🐱🐢'), {
  toggleCase: (rawChar) => (rawChar === '🐱' ? '🐯' : '🐇'),
});
// Examples of generated values: "🐯🐇🐱🐢🐯🐢", "🐱🐇🐱🐇🐯🐇", "🐱🐢🐯🐢🐱🐢", "🐱🐢🐱🐇🐯🐢", "🐱🐢🐯🐢🐱🐇"…
```

Resources: [API reference](https://fast-check.dev/api-reference/functions/mixedCase.html).  
Available since 1.17.0.
