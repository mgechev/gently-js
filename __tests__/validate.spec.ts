const validate = require('../').validate;

describe('validate', () => {
  it('should validate words', async () => {
    const result = await validate({ text: 'fuck' });
    expect(result).toEqual([{ word: 'fuck' }]);
  });

  it('should validate sentences strictly', async () => {
    const result = await validate({ text: 'Where the fuck is Yuri on Ice Season 2...', strict: true });
    expect(result).toEqual([{ word: 'fuck' }, { syn: 'meth', word: 'Ice' }]);
  });

  it('should validate sentences non-strictly', async () => {
    const result = await validate({ text: 'Where is Yuri on Ice Season 2...' });
    expect(result).toEqual([]);
  });

  it('should perform spell checking', async () => {
    const result = await validate({ text: 'Where the fuckk is Yuri on Ice Season 2...', strict: false });
    expect(result).toEqual([{ word: 'fucks', corrected: 'fuckk' }]);
  });
});
