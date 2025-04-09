describe('Tabs Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the tabs wrapper', async () => {
    await page.waitForSelector('.tabs-wrapper');
    const tabsWrapper = await page.$('.tabs-wrapper');
    expect(tabsWrapper).toExist();
  });
}); 
