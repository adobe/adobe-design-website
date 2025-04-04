const { launchBrowser } = require('./helpers.js');
const { toExist } = require('./helpers.js');


let browser;
let page;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/';

beforeAll(async () => {
  browser = await launchBrowser();
  page = await browser.newPage();
  await page.goto(BASE_URL);

  global.page = page;
  global.BASE_URL = BASE_URL;
});

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

expect.extend({ toExist });
