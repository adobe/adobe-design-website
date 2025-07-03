describe('Fragment Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  xit('should render the fragment block', async () => {
    await page.waitForSelector('.fragment');
    const fragment = await page.$('.fragment');
    expect(fragment).toExist();
  });
});
