describe('Article Header Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}ideas/example-article`);
  });

  it('should render the article header element', async () => {
    const header = await page.$('.article-header');
    expect(header).toExist();
  });
});
