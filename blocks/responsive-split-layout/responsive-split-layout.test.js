describe('Responsive-Split-Layout Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the responsive-split-layout block', async () => {
    await page.waitForSelector('.responsive-split-layout');
    const featureLayouts = await page.$$('.responsive-split-layout');
    expect(featureLayouts.length).toBeGreaterThanOrEqual(1);
  });

  it('should apply the reversed layout class if included', async () => {
    await page.waitForSelector('.responsive-split-layout__image--reverse');
    const featureLayoutImages = await page.$$('.responsive-split-layout__image--reverse');
    expect(featureLayoutImages.length).toBeGreaterThanOrEqual(1);
  });
});
