describe('Callout Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the callout block', async () => {
    await page.waitForSelector('.callout');
    const callouts = await page.$$('.callout');
    expect(callouts.length).toBeGreaterThanOrEqual(1);
  });
});
