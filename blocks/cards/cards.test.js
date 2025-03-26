const { launchBrowser } = require('../../tests/helpers.js');

describe('Cards Block', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should render the cards wrapper', async () => {
    await page.waitForSelector('.cards-wrapper');
    const cardsWrapper = await page.$('.cards-wrapper');
    expect(cardsWrapper).toExist();
  });
}); 