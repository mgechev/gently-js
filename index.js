const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const AllWords = require('./words.json');

const validateWord = (checked, word) => {
  if (checked[word]) {
    return Promise.resolve([]);
  }
  checked[word] = true;
  if (AllWords[word]) {
    return Promise.resolve([{ word }]);
  }
  let offensive = [];
  return new Promise((resolve) => {
    wordpos.lookup(word, all => {
      all.forEach(w => offensive = offensive.concat(w.synonyms.filter(c => AllWords[c])));
      resolve(offensive.map(syn => ({ word, syn })));
    })
  });
};

const validateWords = categories => {
  const checked = {};
  return Promise.all(Object.keys(categories).map(category => Promise.all(categories[category].map(validateWord.bind(null, checked)))))
    .then(all => [].concat.apply([], [].concat.apply([], all)));
};

const strictValidate = s => new Promise((resolve, reject) => wordpos.getPOS(s, cat => validateWords(cat).then(resolve, reject)));
const ignoreSynonyms = s => strictValidate(s).then(errors => errors.filter(e => !e.syn));

module.exports.validate = (sentence, strict = true) => strict ? strictValidate(sentence) : ignoreSynonyms(sentence);
