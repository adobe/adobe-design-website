describe('Form Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
    await page.waitForSelector('.form', { visible: true });
  });

  it('should render the form wrapper', async () => {
    const formWrapper = await page.$('.form');
    expect(formWrapper).toExist();
  });

  it('should contain text inputs', async () => {
    const textInputs = await page.$$('.form input[type="text"]');
    expect(textInputs.length).toBeGreaterThan(0);
  });

  it('should contain radio buttons', async () => {
    const radioButtons = await page.$$('.form input[type="radio"]');
    expect(radioButtons.length).toBeGreaterThan(0);
  });

  it('should contain checkboxes', async () => {
    const checkboxes = await page.$$('.form input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should contain a textarea', async () => {
    const textareas = await page.$$('.form textarea');
    expect(textareas.length).toBeGreaterThan(0);
  });

  it('should contain a toggle switch', async () => {
    const toggles = await page.$$('.form input[type="checkbox"].toggle');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should contain a select dropdown', async () => {
    const selects = await page.$$('.form select');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('should contain a submit button', async () => {
    const submitButtons = await page.$$('.form button[type="submit"]');
    expect(submitButtons.length).toBeGreaterThan(0);
  });
});
