describe('Horizontal Rule Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the horizontal rule', async () => {
    await page.waitForSelector('.horizontal-rule');
    const horizontalRow = await page.$('.horizontal-rule');
    expect(horizontalRow).toExist();
  });
});
