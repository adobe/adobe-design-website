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
    });

    it("should not render the cta block", async () => {
      // Wait for element to not be found in the DOM or to be hidden.
      // Note; this will still return the ElementHandle of the hidden element.
      const cta = await page.waitForSelector('.call-to-action', { hidden: true, timeout: 3000 });
      const isDisplayNone = await page.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.getPropertyValue('display') === 'none';
      }, cta);
      expect(isDisplayNone).toBe(true);
    });
  });
});
