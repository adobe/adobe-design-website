const puppeteer = require('puppeteer');
const { toExist } = require('./helpers.js');


let browser;
let page;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/';

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
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
