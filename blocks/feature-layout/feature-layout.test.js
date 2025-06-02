describe('Feature-Layout Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the feature-layout block', async () => {
    await page.waitForSelector('.feature-layout');
    const featureLayouts = await page.$$('.feature-layout');
    expect(featureLayouts.length).toBeGreaterThanOrEqual(1);
  });

  it('should render the any feature-layout images', async () => {
    await page.waitForSelector('.feature-layout__image');
    const featureLayoutImages = await page.$$('.feature-layout__image');
    expect(featureLayoutImages.length).toBeGreaterThanOrEqual(1);
  });

  it('should render the feature-layout text content', async () => {
    await page.waitForSelector('.feature-layout__content');
    const featureLayoutContent = await page.$$('.feature-layout__content');
    expect(featureLayoutContent.length).toBeGreaterThanOrEqual(1);
  });
});
