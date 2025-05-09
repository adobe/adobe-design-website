describe('Lede Block', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}pattern-library/`);
    });
    
    it('should render the lede block wrapper', async () => {
        const lede = await page.waitForSelector('.lede');
        expect(lede).toExist();
    });

    it('should render a paragraph within the lede block wrapper', async () => {
        const ledeParagraph = await page.waitForSelector('.lede > p');
        expect(ledeParagraph).toExist();
    });

    it('should have some text within the paragraph', async () => {
        const ledeParagraph = await page.waitForSelector('.lede > p');
        const text = await page.evaluate(el => el.textContent.trim(), ledeParagraph);
        expect(text.length).toBeGreaterThan(0);
    });
});
