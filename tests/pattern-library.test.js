describe('Pattern Library Page', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}pattern-library/`);
    });

    test('should have a title', async () => {
        const h1 = await page.$('h1');
        expect(h1).not.toBeNull();
    });
});
