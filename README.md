# Gently

`gently-js` is a module which helps your presence online be more gentle. The module exports a function called `validate({ text, strict = false, spellcheck = true })`, which accepts a sentence as a string and returns if any of the words is abusive.

The strict flag indicates whether `gently-js` should also check the direct synonyms of each word.

This module does not claim high-precision and completeness, it's just a soft reminder that we should be nice to each other ❤️.

## Usage

Install the module with:

```
npm i gently-js
```

Use the module with:

```javascript
const { validate } = require('gently-js);

validate({ text: "I'm pissed off all of this." })
  .then(warnings => {
    // [{ word: 'pissed' }]
    console.log(warnings);
  });

validate({ text: "I'm pissed off all of this.", strict: true })
  .then(warnings => {
    // [{ word: 'off', syn: 'murder' }, { word: 'pissed' }]
    console.log(warnings);
  });
```

## How does it work?

The module performs the following algorithm:

1. Tokenizes the words in the sentence using `wordpos`. This phase drops stop words and removes duplicates.
2. Checks each individual word for spelling errors using `nspell`. If spelling errors are detected, the module validates the suggested words, which are the closest to the original word.
3. Each word goes through validation by comparing it to the data set by [CMU](https://www.cs.cmu.edu/~biglou/resources/bad-words.txt).
4. If the `strict` flag is set to `true`, the module gets all the synonyms of the validated words and validates them against the bad-words data set.
5. The errors are reported in the format:

```ts
interface Report {
  [key: number]: BadWord;
}

interface BadWord {
  word: string;
  corrected: string;
  syn: string;
}
```

## License

MIT
