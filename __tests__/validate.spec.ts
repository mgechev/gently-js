const validate = require('../').validate;

describe('validate', () => {
  it('should validate words', async () => {
    const result = await validate('fuck');
    expect(result).toEqual([{ word: 'fuck' }]);
  });

  it('should validate sentences strictly', async () => {
    const result = await validate('Where the fuck is Yuri on Ice Season 2...');
    expect(result).toEqual([{ word: 'fuck' }, { syn: 'meth', word: 'Ice' }]);
  });

  it('should validate sentences non-strictly', async () => {
    const result = await validate('Where is Yuri on Ice Season 2...', false);
    expect(result).toEqual([]);
  });
});
