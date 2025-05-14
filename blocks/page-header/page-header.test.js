describe('Page Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}`);
  });

  it('should render the page header element', async () => {
    const header = await page.$('.page-header');
    expect(header).toExist();
  });
});
