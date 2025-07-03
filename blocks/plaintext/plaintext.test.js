describe('Constrained Text Block', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}pattern-library/layouts`);
    });

    it('should render the plaintext block', async () => {
        const block = await page.waitForSelector('.plaintext');
        expect(block).toExist();
    });
});
