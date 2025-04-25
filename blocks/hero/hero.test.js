describe('Hero Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the hero', async () => {
    await page.waitForSelector('.hero');
    const heroWrapper = await page.$('.hero');
    expect(heroWrapper).toExist();
  });

  it('should contain an h1 heading', async () => {
    const heading = await page.$('.hero h1');
    expect(heading).toExist();
  });

  xit("should contain a responsive picture element", async () => {
    await page.waitForSelector(".hero picture");
    const picture = await page.$(".hero picture");
    expect(picture).toExist();

    await page.waitForSelector(".hero picture source");
    const sources = await page.$$(".hero picture source");
    expect(sources.length).toBe(3);

    await page.waitForSelector('.hero picture img[loading="eager"]');
    const img = await page.$('.hero picture img[loading="eager"]');
    expect(img).toExist();
  });
});
