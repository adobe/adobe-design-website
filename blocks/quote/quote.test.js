const { launchBrowser } = require('../../tests/helpers.js');

describe('Quote Block', () => {
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

  it('should render the quote wrapper', async () => {
    await page.waitForSelector('.quote-wrapper');
    const quoteWrapper = await page.$('.quote-wrapper');
    expect(quoteWrapper).toExist();
  });
}); 