describe('Accordion Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the accordion wrapper', async () => {
    await page.waitForSelector('.accordion-wrapper');
    const accordionWrapper = await page.$('.accordion-wrapper');
    expect(accordionWrapper).toExist();
  });
}); 