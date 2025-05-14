describe('Filter Group Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  async function isButtonSelected(button) {
    return await button.evaluate(el =>
      el.classList.contains('filter-group__button--selected')
    );
  };

  it('should render the filter group label', async () => {
    const label = await page.waitForSelector('.filter-group__label');
    expect(label).toExist();
    
    const labelText = await label.evaluate(el => el.textContent);
    expect(labelText).toBe('Filter articles:');
  });

  it('should render the filter group list', async () => {
    const filterGroup = await page.waitForSelector('.filter-group__list');
    expect(filterGroup).toExist();
  });

  it('should render filter buttons', async () => {
    await page.waitForSelector('.filter-group__button');
    const buttons = await page.$$('.filter-group__button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have first button selected by default', async () => {
    const selectedButton = await page.waitForSelector('.filter-group__button--selected');
    const isFirstButton = await selectedButton.evaluate(el => 
      el === el.parentElement.firstElementChild
    );
    expect(isFirstButton).toBe(true);
  });

  it('should change selected state on button click', async () => {
    await page.waitForSelector('.filter-group__button');
    const buttons = await page.$$('.filter-group__button');

    // Click second button
    await buttons[1].click();
  
    // Check if second button is selected
    expect(await isButtonSelected(buttons[1])).toBe(true);

    // Check if first ("All") button is no longer selected
    expect(await isButtonSelected(buttons[0])).toBe(false);
  });

  it('should allow multiple filters to be selected', async () => {
    await page.waitForSelector('.filter-group__button');
    const buttons = await page.$$('.filter-group__button');

    // Click third button
    await buttons[2].click();

    // Check if both second and third buttons are selected
    expect(await isButtonSelected(buttons[1])).toBe(true);
    expect(await isButtonSelected(buttons[2])).toBe(true);
  });

  it('should allow "all" button to reset other selected filters', async () => {
    await page.waitForSelector('.filter-group__button');
    const buttons = await page.$$('.filter-group__button');

    // Click the "All" reset.
    await buttons[0].click();
  
    // Check that only "All" is selected.
    expect(await isButtonSelected(buttons[0])).toBe(true);
    expect(await isButtonSelected(buttons[1])).toBe(false);
    expect(await isButtonSelected(buttons[2])).toBe(false);
  });

  it('should have proper ARIA attributes', async () => {
    const filterGroup = await page.waitForSelector('.filter-group__list');
    
    const role = await filterGroup.evaluate(el => el.getAttribute('role'));
    expect(role).toBe('group');
    
    const ariaLabel = await filterGroup.evaluate(el => el.getAttribute('aria-label'));
    expect(ariaLabel).toBe('Filter options');

    const id = await filterGroup.evaluate(el => el.id);
    expect(id).toBe('filter-group');

    const selectedButton = await page.$('.filter-group__button--selected');
    const ariaPressed = await selectedButton.evaluate(el => el.getAttribute('aria-pressed'));
    expect(ariaPressed).toBe('true');
  });

  it('should have label properly associated with filter group', async () => {
    const label = await page.waitForSelector('.filter-group__label');
    
    const id = await label.evaluate(el => el.id);
    expect(id).toBe('filter-group-label');

    const filterGroup = await page.$('.filter-group__list');
    const describedBy = await filterGroup.evaluate(el => el.getAttribute('aria-describedby'));
    expect(describedBy).toBe('filter-group-label');
  });
});
