describe('Recent Ideas Block', () => {
    beforeAll(async () => {
        await page.goto(`${global.BASE_URL}pattern-library/`);
    });
    
    it('should render the recent ideas block wrapper', async () => {
        const block = await page.waitForSelector('.recent-ideas');
        expect(block).toExist();
    });

    it('should render a card, within its wrappers', async () => {
        const card = await page.waitForSelector('.recent-ideas .grid-item .card-container .card');
        expect(card).toExist();
    });

    it('should have title text within the card', async () => {
        const heading = await page.waitForSelector('.recent-ideas .grid-item .card-container .card .card__title');
        const headingText = await page.evaluate(el => el.textContent.trim(), heading);
        expect(headingText.length).toBeGreaterThan(0);
    });

    it('should have description text within the card', async () => {
        const description = await page.waitForSelector('.recent-ideas .grid-item .card-container .card .card__description');
        const descriptionText = await page.evaluate(el => el.textContent.trim(), description);
        expect(descriptionText.length).toBeGreaterThan(0);
    });

    it('should have picture element within the card', async () => {
        const picture = await page.waitForSelector('.recent-ideas .grid-item .card-container .card picture.card__image');
        expect(picture).toExist();
    });
});
