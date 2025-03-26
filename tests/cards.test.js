const puppeteer = require('puppeteer');

describe('Cards Block', () => {
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

  it('should render the cards wrapper', async () => {
    await page.waitForSelector('.cards-wrapper');
    const cardsWrapper = await page.$('.cards-wrapper');
    expect(cardsWrapper).toExist();
  });
}); 