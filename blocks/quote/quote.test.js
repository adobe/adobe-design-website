describe('Quote Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the quote wrapper', async () => {
    await page.waitForSelector('.quote-wrapper');
    const quoteWrapper = await page.$('.quote-wrapper');
    expect(quoteWrapper).toExist();
  });
});
