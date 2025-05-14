describe('Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the header wrapper', async () => {
    await page.waitForSelector('.header');
    const headerWrapper = await page.$('.header');
    expect(headerWrapper).toExist();
  });

  it('should render the nav heading block', async () => {
    await page.waitForSelector('.nav-heading');
    const nav = await page.$('.nav-heading');
    expect(nav).toExist();
  });
});
