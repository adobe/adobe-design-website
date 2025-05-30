describe('Constrained Text Block', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}pattern-library/`);
    });

    it('should render the constrained text block', async () => {
        const block = await page.waitForSelector('.constrained-text');
        expect(block).toExist();
    });
});
