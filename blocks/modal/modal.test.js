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
      const searchButton = await page.$('a[href*="/modals/search-modal"]');
      await searchButton.click();

      // Wait for modal to be visible
      await page.waitForSelector('dialog[open]', { visible: true });
    });

    xit('opens the modal with the correct structure and closes modal', async () => {
      const dialog = await page.$('dialog[open]');
      expect(dialog).toExist();

      const closeButton = await page.$('button.close-button[aria-label="Close"]');
      expect(closeButton).toExist();

      const modalContent = await page.$('.modal-content');
      expect(modalContent).toExist();

      await closeButton.click();
      await page.waitForFunction(() => !document.querySelector('dialog[open]'));

      const dialogAfterClose = await page.$('dialog[open]');
      expect(dialogAfterClose).toBeNull();
    });
  });

});
