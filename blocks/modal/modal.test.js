describe('Modal Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the modal trigger button', async () => {
    const searchButton = await page.$('a[href*="/modals/search-modal"]');
    expect(searchButton).toExist();

    const searchIcon = await page.$('.icon-search img[data-icon-name="search"]');
    expect(searchIcon).toExist();
  });

  describe('when clicked', () => {
    beforeEach(async () => {
      await page.waitForSelector('a[href*="/modals/search-modal"]', { visible: true });
      const searchButton = await page.$('a[href*="/modals/search-modal"]');
      await searchButton.click();
      
      // Wait for modal to be visible
      await page.waitForSelector('dialog[open]', { visible: true });
    });

    it('should open a modal with proper structure', async () => {
      const dialog = await page.$('dialog[open]');
      expect(dialog).toExist();

      const closeButton = await page.$('button.close-button[aria-label="Close"]');
      expect(closeButton).toExist();

      const modalContent = await page.$('.modal-content');
      expect(modalContent).toExist();
    });
  });
}); 