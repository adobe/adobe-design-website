describe('Hero Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the hero wrapper', async () => {
    await page.waitForSelector('.hero-wrapper');
    const heroWrapper = await page.$('.hero-wrapper');
    expect(heroWrapper).toExist();
  });

  it('should contain an h1 heading', async () => {
    const heading = await page.$('.hero-wrapper h1');
    expect(heading).toExist();
  });

  it('should contain a responsive picture element', async () => {
    const picture = await page.$('.hero-wrapper picture');
    expect(picture).toExist();

    const sources = await page.$$('.hero-wrapper picture source');
    expect(sources.length).toBe(3);

    const img = await page.$('.hero-wrapper picture img[loading="eager"]');
    expect(img).toExist();
  });
}); 