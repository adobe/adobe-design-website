describe('Fragment Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the fragment block', async () => {
    await page.waitForSelector('.fragment-wrapper');
    const fragment = await page.$('.fragment-wrapper');
    expect(fragment).toExist();
  });
}); 
