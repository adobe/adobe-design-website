/**
 * @file Some helper utility functions for filter group.
 */

/**
 * Update selected state of filter button.
 * @param {HTMLButtonElement} buttonElement 
 * @param {boolean} newSelected New selected state
 */
export const updateFilter = (buttonElement, newSelected = false) => {
    buttonElement.classList.toggle('filter-group__button--selected', newSelected);
    buttonElement.setAttribute('aria-pressed', newSelected ? 'true' : 'false');
};

/**
 * Get an array containing the text value of all selected filters.
 * When "All" is selected, this returns an empty array.
 * @param {Element} parentElement 
 * @returns {string[]}
 */
export const getCurrentFiltersArray = (parentElement) => Array.from(
    parentElement.querySelectorAll('.filter-group__button:not(:first-of-type)[aria-pressed="true"]'), btn => btn.textContent.trim()
) || [];
