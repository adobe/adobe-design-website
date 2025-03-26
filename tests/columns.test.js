const puppeteer = require('puppeteer');

describe('Columns Block', () => {
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

  it('should render the columns wrapper', async () => {
    await page.waitForSelector('.columns-wrapper');
    const columnsWrapper = await page.$('.columns-wrapper');
    expect(columnsWrapper).toExist();
  });

  it('should contain a columns block with multiple divs', async () => {
    const columnsBlock = await page.$('.columns');
    expect(columnsBlock).toExist();

    const divsInColumns = await page.$$('.columns > div');
    expect(divsInColumns.length).toBeGreaterThan(1);
  });
}); 