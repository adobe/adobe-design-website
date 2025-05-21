describe('Image with Caption Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
    await page.waitForSelector('#main-content');
  });

  it('should render an image with a caption', async () => {
    const image = await page.$('.image-with-caption');
    expect(image).toExist();
  });
});
