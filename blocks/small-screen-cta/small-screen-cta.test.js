describe('Small Screen CTA Block', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 350, height: 1000 });
    await page.goto(`${global.BASE_URL}pattern-library/`);
    await page.waitForSelector('.call-to-action');
  });

  it('On small screens should render the cta block', async () => {
    const cta = await page.waitForSelector('.call-to-action');
    expect(cta).toExist();
  });

  describe("On large screens", () => {
    beforeAll(async () => {
      await page.setViewport({ width: 1500, height: 1000 });
      await page.goto(`${global.BASE_URL}`);
      await page.$('#main-content');
    });

    xit("should not render the cta block", async () => {
      const cta = await page.waitForSelector('.call-to-action', { hidden: true, timeout: 3000 });
      expect(cta).toBeNull();
    });
  });
});
