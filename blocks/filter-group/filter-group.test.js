describe('Filter Group Block', () => {
  beforeAll(async () => {
    await page.goto(`${global.BASE_URL}pattern-library/`);
  });

  it('should render the filter group label', async () => {
    await page.waitForSelector('.filter-group__label');
    const label = await page.$('.filter-group__label');
    expect(label).toExist();
    
    const labelText = await label.evaluate(el => el.textContent);
    expect(labelText).toBe('Filter articles:');
  });

  it('should render the filter group list', async () => {
    await page.waitForSelector('.filter-group__list');
    const filterGroup = await page.$('.filter-group__list');
    expect(filterGroup).toExist();
  });

  it('should render filter buttons', async () => {
    await page.waitForSelector('.filter-group__button');
    const buttons = await page.$$('.filter-group__button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have first button selected by default', async () => {
    await page.waitForSelector('.filter-group__button--selected');
    const selectedButton = await page.$('.filter-group__button--selected');
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
    const isSelected = await buttons[1].evaluate(el => 
      el.classList.contains('filter-group__button--selected')
    );
    expect(isSelected).toBe(true);
    
    // Check if first button is no longer selected
    const isFirstSelected = await buttons[0].evaluate(el => 
      el.classList.contains('filter-group__button--selected')
    );
    expect(isFirstSelected).toBe(false);
  });

  it('should have proper ARIA attributes', async () => {
    await page.waitForSelector('.filter-group__list');
    const filterGroup = await page.$('.filter-group__list');
    
    const role = await filterGroup.evaluate(el => el.getAttribute('role'));
    expect(role).toBe('group');
    
    const ariaLabel = await filterGroup.evaluate(el => el.getAttribute('aria-label'));
    expect(ariaLabel).toBe('Filter options');
    
    const id = await filterGroup.evaluate(el => el.id);
    expect(id).toBe('filter-group');
  });

  it('should have label properly associated with filter group', async () => {
    await page.waitForSelector('.filter-group__label');
    const label = await page.$('.filter-group__label');
    
    const forAttribute = await label.evaluate(el => el.getAttribute('for'));
    expect(forAttribute).toBe('filter-group');
  });
});
