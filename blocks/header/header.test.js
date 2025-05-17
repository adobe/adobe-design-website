describe("Header Navigation Block", () => {
  beforeAll(async () => {
    await page.setViewport({ width: 700, height: 1000 });
    await page.goto(`${global.BASE_URL}`);
    await page.waitForSelector(".nav");
  });

  it("should render the nav", async () => {
    const nav = await page.$(".nav");
    expect(nav).toExist();

    const navWrapper = await page.$(".nav-wrapper");
    expect(navWrapper).toExist();
  });

  it("should render the nav contents", async () => {
    const navHomeLink = await page.$(".nav__home-link");
    expect(navHomeLink).toExist();

    const navPageLinks = await page.$(".nav__page-links");
    expect(navPageLinks).toExist();

    const navTools = await page.$(".nav__toolbar");
    expect(navTools).toExist();
  });

  it("should render a menu button and panel", async () => {
    const menuPanel = await page.$(".nav__menu");
    expect(menuPanel).toExist();

    const menuButton = await page.$(".nav__menu-button");
    expect(menuButton).toExist();
  });

  describe("On large screens", () => {
    beforeAll(async () => {
      await page.setViewport({ width: 1500, height: 1000 });
      await page.goto(`${global.BASE_URL}`);
      await page.waitForSelector(".nav");
    });

    it("should not render a menu button or panel", async () => {
      const menuPanel = await page.$(".nav__menu");
      expect(menuPanel).toBeNull();

      const menuButton = await page.$(".nav__menu-button");
      expect(menuButton).toBeNull();
    });
  });
});
