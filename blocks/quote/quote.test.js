describe('Quote Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the blockquote element', async () => {
    await page.waitForSelector('.quote blockquote');
    const blockquote = await page.$('.quote blockquote');
    expect(blockquote).toExist();
  });

  it('should render the quote text', async () => {
    await page.waitForSelector('.quote__quotation');
    const quoteText = await page.$('.quote__quotation');
    expect(quoteText).toExist();
  });

  it('should render the attribution when present', async () => {
    await page.waitForSelector('.quote__attribution');
    const attribution = await page.$('.quote__attribution');
    expect(attribution).toExist();
  });

  it('should render the attribution with cite element', async () => {
    await page.waitForSelector('.quote__attribution cite');
    const cite = await page.$('.quote__attribution cite');
    expect(cite).toExist();
  });

  it('should render the attribution with utility class', async () => {
    await page.waitForSelector('.quote__attribution.util-detail-s');
    const attribution = await page.$('.quote__attribution.util-detail-s');
    expect(attribution).toExist();
  });

  it('should render attribution link when URL is provided', async () => {
    await page.waitForSelector('.quote__attribution cite a');
    const attributionLink = await page.$('.quote__attribution cite a');
    if (attributionLink) {
      expect(attributionLink).toExist();
    }
  });
});
