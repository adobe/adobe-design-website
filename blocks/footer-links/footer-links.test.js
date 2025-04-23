describe('Footer Links Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}footer`);
  });

  it('should render the footer links block', async () => {
    await page.waitForSelector('.footer-links');
    const footer = await page.$('.footer-links');
    expect(footer).toExist();
  });
});
