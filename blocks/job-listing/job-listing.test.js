describe('Job-Listing Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the job-listing block', async () => {
    await page.waitForSelector('.job-list .job-listing');
    const jobListings = await page.$$('.job-list .job-listing');
    expect(jobListings.length).toBeGreaterThanOrEqual(1);
  });

  describe('Job-Listing', () => {
    beforeAll(async () => {
      await page.waitForSelector('.job-list .job-listing');
    });

    it('should have correct structure with content wrapper and utility classes', async () => {
      const hasContent = await page.$('.job-list .job-listing__content');
      expect(hasContent).toExist();

      const hasTitle = await page.$('.job-list .job-listing__title');
      expect(hasTitle).toExist();

      const hasSubheading = await page.$('.job-list .job-listing__subheading');
      expect(hasSubheading).toExist();

      const hasDetail = await page.$('.job-list .job-listing__detail');
      expect(hasDetail).toExist();
    });

    it('should link to the correct job posting URL', async () => {
      const jobListing = await page.$('.job-list .job-listing[href^="https://adobe.design/jobs/job-posts/"]');
      expect(jobListing).toExist();
    });
  });
});
