describe('Horizontal Row Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the horizontal row', async () => {
    await page.waitForSelector('.horizontal-row');
    const horizontalRow = await page.$('.horizontal-row');
    expect(horizontalRow).toExist();
  });
});
