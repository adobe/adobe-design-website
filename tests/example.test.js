const puppeteer = require('puppeteer');

describe('The application home page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it('renders a navigation', async () => {
    await page.goto('http://localhost:3000/');

    // Use Puppeteer to select the header
    await page.waitForSelector('#nav');
    const pageNav = await page.$('#nav');

    // Check that the header is on the page
    expect(pageNav).toExist();

  }, 7000); // Set a timeout of 7 seconds

  afterAll(async () => {
    await browser.close();
  });
});
