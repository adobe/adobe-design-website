describe('Form Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the form wrapper', async () => {
    await page.waitForSelector('.form-wrapper');
    const formWrapper = await page.$('.form-wrapper');
    expect(formWrapper).toExist();
  });

  it('should contain form configuration links', async () => {
    const formDataLink = await page.$('a[href*="/form.json"]');
    expect(formDataLink).toExist();

    const submitLink = await page.$('a[href*="httpbin.org/post"]');
    expect(submitLink).toExist();
  });
});
