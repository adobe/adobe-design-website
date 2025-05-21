describe('Footer Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
    await page.waitForSelector('.footer-content');
  });

  it('should render the footer block', async () => {
    await page.waitForSelector('.footer-content');
    const footer = await page.$('.footer-content');
    expect(footer).toExist();
  });
});
