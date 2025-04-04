describe('Cards Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the cards wrapper', async () => {
    await page.waitForSelector('.cards-wrapper');
    const cardsWrapper = await page.$('.cards-wrapper');
    expect(cardsWrapper).toExist();
  });
});
