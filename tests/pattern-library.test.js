const { launchBrowser } = require('./helpers.js');

describe('Pattern Library Page', () => {
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

    test('should have a title', async () => {
        const h1 = await page.$('h1');
        expect(h1).not.toBeNull();
    });
});
