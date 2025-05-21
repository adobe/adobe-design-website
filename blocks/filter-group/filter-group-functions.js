/**
 * @file Filter group functionality, including event listener logic.
 */

import { dataStore } from '../../scripts/dataStore.js';
import { updateFilter, getCurrentFiltersArray } from './filter-group-utils.js';
import { applyTemporaryMockupTags } from './filter-group-temp-mockup.js';

/**
 * Remove filter buttons for tags that are not assigned to any articles.
 * 
 * @param {parentElement} parentElement Look for the filter buttons within this element. Usually the filter group.
 */
export const removeUnusedTags = async (parentElement) => {
    const allArticles = await dataStore.getData(dataStore.commonEndpoints.queryIndex);
    if (allArticles?.data?.length > 0) {
        parentElement.querySelectorAll('.filter-group__button:not(:first-of-type)').forEach((btn) => {
            if (!allArticles?.data?.some(article => article?.tag && btn.textContent === article.tag)){
                btn.remove();
            }
        });
    }
};

/**
 * Update all articles displayed on the page with ones that have tags
 * that match the currently selected filters.
 * 
 * TODO: work with real Ideas page content. This function is currently mockup/placeholder functionality
 * and may need to partially move to the ideas/stories feed block.
 * 
 * TODO: rate limit calls to this to avoid rapid-fire filter changes calling it lots of times; use our debounce utility.
 * 
 * @param {string[]} selectedFilters Show articles with these filter/tag name(s)
 */
const refreshArticleContent = (selectedFilters = []) => {
    // TODO: remove this when ideas page content and functionality is finalized.
    applyTemporaryMockupTags();

    // Show/hide article cards based on selected tags.
    document.querySelectorAll('.card')?.forEach(article => {
        // "All" reset is active. Display all articles.
        if (selectedFilters.length == 0){
            article.style.display = '';
            return;
        }

        // Show/hide based on data-tags applied to the article.
        if (article.dataset?.tags) {
            const tagsArray = article.dataset.tags.split(',');
            const hasTag = selectedFilters.some(tag => tagsArray.includes(tag));
            article.style.display = hasTag ? '' : 'none';
        }
    });
};

/**
 * Handle click on a filter button from the parent container. Events are bubbled
 * up from the button. Triggers functionality to update filtered content and
 * selected state.
 * 
 * @param {PointerEvent} event
 */
export const handleFilterClick = function (event) {
    const filterGroup = this;
    const clickedButton = event.target.closest('.filter-group__button');
    if (!clickedButton) return;

    // State of button and whether it's the special "All" filter reset.
    const isSelected = clickedButton.getAttribute('aria-pressed') === 'true';
    const isAllFilter = clickedButton.matches(':first-of-type');

    if (isAllFilter) {
        // "All" filter -----
        // Does nothing if already selected.
        if (isSelected) return;
        // Set all other filters as unselected when "All" is selected.
        filterGroup.querySelectorAll('.filter-group__button').forEach((btn) => {
            updateFilter(btn, false);
        });
        updateFilter(clickedButton, true);
    } else {
        // Regular filters -----
        // Set filter as selected, and deselect "All" if it was selected.
        const allButton = filterGroup.querySelector('.filter-group__button:first-of-type');
        updateFilter(clickedButton, !isSelected);
        
        // Update state of "All" filter:
        // - If at least one filter is selected, "All" gets deselected.
        // - In the case that the only selected filter was just deselected, set "All" back to selected.
        const hasAnySelectedFilter = document.querySelector('.filter-group__button:not(:first-of-type)[aria-pressed="true"]') != null;
        updateFilter(allButton, !hasAnySelectedFilter);
    }

    // Update array of selected filters, and refresh articles displayed on page.
    const selectedFilters = getCurrentFiltersArray(filterGroup);
    filterGroup.dataset.selectedFilters = selectedFilters;
    refreshArticleContent(selectedFilters);
};
