describe('Footer Copyright Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}footer`);
  });

  it('should render the footer copyright block', async () => {
    await page.waitForSelector('.footer-copyright');
    const footer = await page.$('.footer-copyright');
    expect(footer).toExist();
  });
});
