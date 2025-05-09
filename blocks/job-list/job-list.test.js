describe('Job-List Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the job-list block', async () => {
    await page.waitForSelector('.job-list');
    const jobList = await page.$('.job-list');
    expect(jobList).toExist();
  });

  describe('Job-List', () => {
    beforeAll(async () => {
      await page.waitForSelector('.job-list');
      await page.waitForSelector('.job-list__department');
      await page.waitForSelector('.job-list__listings');
    });

    it('should have department title with utility class', async () => {
      const hasDepartment = await page.$('.job-list__department');
      expect(hasDepartment).toExist();
    });

    it('should have listings container with job listings', async () => {
      const hasListings = await page.$('.job-list__listings');
      expect(hasListings).toExist();

      const jobListing = await page.$('.job-listing');
      expect(jobListing).toExist();
    });
  });
});
