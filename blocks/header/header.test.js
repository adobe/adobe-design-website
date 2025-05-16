describe('Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}`);
    await page.waitForSelector('.nav');
  });

  it('should render the nav', async () => {
    const nav = await page.$('.nav');
    expect(nav).toExist();
  });

  it('should render the nav contents', async () => {
    const navHomeLink = await page.$('.nav__home-link');
    expect(navHomeLink).toExist();

    const navPageLinks = await page.$('.nav__page-links');
    expect(navPageLinks).toExist();

    const navTools = await page.$('.nav__toolbar');
    expect(navTools).toExist();
  });
});
