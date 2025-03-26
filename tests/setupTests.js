const puppeteer = require('puppeteer');
const { toExist } = require('./helpers');


let browser;
let page;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/';

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto(BASE_URL);

  global.page = page;
  global.BASE_URL = BASE_URL;
});

afterAll(async () => {
  await browser.close();
});

expect.extend({ toExist });
