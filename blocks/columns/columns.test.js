const { launchBrowser } = require('../../tests/helpers.js');

describe('Columns Block', () => {
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