describe('Search Block', () => {
    beforeAll(async () => {
      await page.goto(`${global.BASE_URL}pattern-library/`);
    });

    it('should render the search block', async () => {
      await page.waitForSelector('.search__box');
      const searchBox = await page.$('.search__box');
      expect(searchBox).toExist();
    });

    // TODO: update tests in search functionality ticket
    xit('should fetch data and display results', async () => {
      await page.waitForSelector('.search__input');
      const searchInput = await page.$('.search__input');
      await searchInput.type('Test');

      await page.waitForSelector('.search__results-item');
      const results = await page.$$('.search__results-item');
      expect(results.length).toBeGreaterThan(0);
    });

    xit('should display no results message when no matches are found', async () => {
      await page.waitForSelector('.search__input');
      const searchInput = await page.$('.search__input');
      await searchInput.click();
      await searchInput.press('Backspace');
      await searchInput.type('Nonexistent');

      await page.waitForSelector('.search__results--no-results');
      const noResultsMessage = await page.$('.search__results--no-results');
      expect(noResultsMessage).toExist();
    });
  });
