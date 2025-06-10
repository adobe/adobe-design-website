describe('Ideas Block', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}ideas/`);
    });
    
    it('should render the ideas block container', async () => {
        const ideasBlock = await page.waitForSelector('.ideas');
        expect(ideasBlock).toExist();
    });

    it('should fetch ideas and render multiple cards', async () => {
        await page.waitForFunction(() => {
            return document.querySelectorAll('.ideas .card').length > 1;
        });
        const cardCount = await page.$$eval('.ideas .card', els => els.length);
        expect(cardCount).toBeGreaterThan(1);
    });

    it('load button should add more articles', async () => {
        await page.waitForFunction(() => {
            return document.querySelectorAll('.ideas .card').length > 1;
        });
        const cardCount = await page.$$eval('.ideas .card', els => els.length);

        const loadButton = await page.waitForSelector('.ideas .ideas__load-button');
        expect(loadButton).toExist();

        await loadButton.evaluate(el => el.click());
        const loadedArticle = await page.waitForSelector('.grid-item[data-added="true"]');
        expect(loadedArticle).toExist();

        const newCardCount = await page.$$eval('.ideas .card', els => els.length);
        expect(newCardCount).toBeGreaterThan(cardCount);
    });
});
