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
    await page.waitForSelector('.quote-quotation');
    const quoteText = await page.$('.quote-quotation');
    expect(quoteText).toExist();
  });

  it('should render the attribution when present', async () => {
    await page.waitForSelector('.quote-attribution');
    const attribution = await page.$('.quote-attribution');
    expect(attribution).toExist();
  });

  it('should render the attribution with cite element', async () => {
    await page.waitForSelector('.quote-attribution cite');
    const cite = await page.$('.quote-attribution cite');
    expect(cite).toExist();
  });

  it('should render the attribution text in a paragraph', async () => {
    await page.waitForSelector('.quote-attribution cite p');
    const attributionText = await page.$('.quote-attribution cite p');
    expect(attributionText).toExist();
  });

  it('should render attribution link when URL is provided', async () => {
    await page.waitForSelector('.quote-attribution cite p a');
    const attributionLink = await page.$('.quote-attribution cite p a');
    if (attributionLink) {
      expect(attributionLink).toExist();
    }
  });
});
