describe('Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the header wrapper', async () => {
    await page.waitForSelector('.header-wrapper');
    const headerWrapper = await page.$('.header-wrapper');
    expect(headerWrapper).toExist();
  });
}); 
