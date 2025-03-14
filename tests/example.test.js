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

    // // this matcher checks if an element on the page exists

    expect.extend({

      toExist: (received) => {
        const pass = received !== null;

        if (pass) {
          return {

            message: () => 'Expected element not to exist, but it does.',

            pass: true,

          };
        }

        return {

          message: () => 'Expected element to exist, but it does not.',

          pass: false,

        };
      },

    });

    // Use Puppeteer to select the header
    await page.waitForSelector('#nav');
    const pageNav = await page.$('#nav');

    // check that the header is on the page

    expect(pageNav).toExist();

  }, 7000); // Set a timeout of 7 seconds

  afterAll(async () => {
    await browser.close();
  });
});
