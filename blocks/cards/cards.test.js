describe('Cards Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the cards wrapper', async () => {
    await page.waitForSelector('.card');
    const cardsWrapper = await page.$('.card');
    expect(cardsWrapper).toExist();
  });
});
