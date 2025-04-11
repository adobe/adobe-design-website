describe('Link-List Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the link-list block', async () => {
    await page.waitForSelector('.link-list');
    const linkLists = await page.$$('.link-list');
    expect(linkLists.length).toBeGreaterThanOrEqual(1);
  });

  it('should render the link-list title', async () => {
    await page.waitForSelector('.link-list__title');
    const linkListTitles = await page.$$('.link-list__title');
    expect(linkListTitles.length).toBeGreaterThanOrEqual(1);
  });

  it('should render the link-list footer link, if it exists', async () => {
    await page.waitForSelector('.link-list > a');
    const linkListsWithFooterLink = await page.$$('.link-list > a');

    if (linkListsWithFooterLink) {
      expect(linkListsWithFooterLink.length).toBeGreaterThanOrEqual(1);
    };
  })

  describe('Link-List-Item', () => {
    beforeAll(async () => {
      await page.waitForSelector('.link-list-item');
    });

    it('should apply an external link class when the link points outside of adobe.design', async () => {
      const linkListItemWithExternalLink = await page.$('.link-list-item:not([href^="https://adobe.design"])');

      if (linkListItemWithExternalLink) {
        const hasExternalLinkClass = await linkListItemWithExternalLink.evaluate((el) => el.classList.contains('link-list-item--external'));
        expect(hasExternalLinkClass).toBe(true);
      } else {
        console.log('No link-list-items with external links found.');
      };
    });

    it('should have job post classes applied when the link is a job posting', async () => {
      const linkListItemWithjobLink = await page.$('.link-list-item[href^="https://adobe.design/jobs/job-posts/"]');

      if (linkListItemWithjobLink) {
        const linkListItemWithJobLinkChildren = await linkListItemWithjobLink.$$('span');

        linkListItemWithJobLinkChildren.forEach(async (child) => {
          const classes = await child.evaluate((el) => el.classList);
          const hasJobClass = classes[0].startsWith('link-list-item__job');
          expect(hasJobClass).toBe(true);
        });
      } else {
        console.log('No link-list-items with job links found.');
      };
    });
  });
});
