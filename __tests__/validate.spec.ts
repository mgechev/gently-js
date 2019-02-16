const validate = require('../').validate;

describe('validate', () => {
  it('should validate words', async () => {
    const result = await validate('fuck');
    expect(result).toEqual([{ word: 'fuck' }]);
  })
});
