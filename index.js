const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const AllWords = require('./words.json');
const dictionary = require('dictionary-en-us')
const nspell = require('nspell')
 
let Spell = null;
 
const ondictionary = (err, dict) => {
  if (err) throw err;
  Spell = nspell(dict)
};

const loadDictionary = () => {
  if (Spell) {
    return Promise.resolve(Spell);
  }
  return new Promise((resolve, reject) => {
    dictionary((err, dict) => {
      if (err) {
        reject(err);
        return;
      }
      ondictionary(err, dict);
      resolve(Spell);
    })
  });
};

const validateWord = (word, checked, corrected) => {
  if (checked[word]) {
    return Promise.resolve([]);
  }
  checked[word] = true;
  if (AllWords[word]) {
    const result = { word };
    if (corrected) {
      result.corrected = corrected;
    }
    return Promise.resolve([result]);
  }
  let offensive = [];
  return new Promise((resolve) => {
    wordpos.lookup(word, all => {
      all.forEach(w => offensive = offensive.concat(w.synonyms.filter(c => AllWords[c])));
      resolve(offensive.map(syn => ({ word, syn })));
    })
  });
};

const validateCategory = (category, spell, checked, spellcheck) => {
  return Promise.all(category.map(word => {
    if (!spellcheck || spell.correct(word)) return validateWord(word, checked);

    const suggestions = spell.suggest(word);
    return Promise.all(suggestions.map(corrected => validateWord(corrected, checked, word)))
      .then(results => [].concat.apply([], results))
  }))
}

const validateWords = (categoryMap, spellcheck) => {
  return loadDictionary()
    .then(spell => {
      const checked = {};
      const categories = Object.keys(categoryMap);
      return Promise.all(categories.map(category => validateCategory(categoryMap[category], spell, checked, spellcheck)))
        .then(all => [].concat.apply([], [].concat.apply([], all)));
    })
};

const strictValidate = (s, spellcheck) => new Promise((resolve, reject) => wordpos.getPOS(s, cat => validateWords(cat, spellcheck).then(resolve, reject)));
const ignoreSynonyms = (s, spellcheck) => strictValidate(s, spellcheck).then(errors => errors.filter(e => !e.syn));

module.exports.validate = ({ text, spellcheck = true, strict = false }) => strict ? strictValidate(text, spellcheck) : ignoreSynonyms(text, spellcheck);
