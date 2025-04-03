describe('Footer Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the footer block', async () => {
    await page.waitForSelector('.footer-wrapper');
    const footer = await page.$('.footer-wrapper');
    expect(footer).toExist();
  });
}); 