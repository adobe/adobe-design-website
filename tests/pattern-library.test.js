const puppeteer = require('puppeteer');

describe('Pattern Library Page', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('https://main--adobe-design-website--adobe.aem.live/pattern-library/');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should have a title', async () => {
        const h1 = await page.$('h1');
        expect(h1).not.toBeNull();
    });
});
