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

module.exports.validate = s => new Promise((resolve, reject) => wordpos.getPOS(s, cat => validateWords(cat).then(resolve, reject)));
