const puppeteer = require('puppeteer');

describe('Quote Block', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000/pattern-library/');
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