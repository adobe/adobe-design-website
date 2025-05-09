describe('Section Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the section header element', async () => {
    await page.waitForSelector('.section-header');
    const header = await page.$('.section-header');
    expect(header).toExist();
  });
});
