describe('Footer Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the footer block', async () => {
    await page.waitForSelector('.footer');
    const footer = await page.$('.footer');
    expect(footer).toExist();
  });
});
