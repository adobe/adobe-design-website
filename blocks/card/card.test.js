describe('Card Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the card element', async () => {
    await page.waitForSelector('.card-box');
    const card = await page.$('.card-box');
    expect(card).toExist();
  });

  it('should render the card title', async () => {
    await page.waitForSelector('.card__title');
    const title = await page.$('.card__title');
    expect(title).toExist();
  });

  it('should render the card description', async () => {
    await page.waitForSelector('.card__description');
    const description = await page.$('.card__description');
    expect(description).toExist();
  });

  it('should apply the vertical orientation class', async () => {
    await page.waitForSelector('.card--vertical');
    const verticalCard = await page.$('.card--vertical');
    expect(verticalCard).toExist();
  });

  it('should apply the horizontal orientation class', async () => {
    await page.waitForSelector('.card--horizontal');
    const horizontalCard = await page.$('.card--horizontal');
    expect(horizontalCard).toExist();
  });

  it('should render the image within the card', async () => {
    await page.waitForSelector('.card__image');
    const image = await page.$('.card__image');
    expect(image).toExist();
  });
});
