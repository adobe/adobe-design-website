describe('Footer Heading Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}footer`);
  });

  it('should render the footer heading block', async () => {
    await page.waitForSelector('.footer-heading');
    const footer = await page.$('.footer-heading');
    expect(footer).toExist();
  });
});
