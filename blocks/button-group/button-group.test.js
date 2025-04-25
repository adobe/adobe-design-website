describe('Button-Group Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the button-group block', async () => {
    await page.waitForSelector('.button-group');
    const linkLists = await page.$$('.button-group');
    expect(linkLists.length).toEqual(1);
  });

  it('should render all links in the group, which have been styled as buttons', async () => {
    await page.waitForSelector('.button-group a[class*="button--"');
    const buttons = await page.$$('.button-group a[class*="button--"]');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
