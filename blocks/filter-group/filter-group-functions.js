/**
 * @file Filter group functionality, including event listener logic.
 */
import { updateFilter, getCurrentFiltersArray } from './filter-group-utils.js';
import { fetchAndBuildIdeas } from '../../scripts/helpers/fetchAndBuildIdeas.js';
import { initialMaxIdeas, calculateGroupTotal, rearrangeFeatures } from '../ideas/ideas-functions.js';
import { debounce } from '../../scripts/helpers/debounce.js';

/**
 * Update all articles displayed on the page with ones that have tags
 * that match the currently selected filters.
 * 
 * @param {string[]} selectedFilters Show articles with these filter/tag name(s)
 */
const refreshArticleContent = async (selectedFilters = []) => {
    const ideasElement = document.querySelector('#main-content .ideas');
    const loadMoreButton = ideasElement.querySelector('.ideas__load-button');
    const noResultsElement = ideasElement.querySelector('.ideas__no-results');
    const ideasGrid = ideasElement.querySelector('.ideas__grid');
    const features = ideasGrid.querySelectorAll('.ideas__feature');
    const layoutType = ideasGrid?.dataset?.layoutType;
    const liveRegion = document.getElementById('ideas-live-region');

    if (!ideasElement || !ideasGrid) {
        // eslint-disable-next-line no-console
        console.error('Could not locate all elements necessary to refresh article content.');
        return;
    }

    // Fetch articles and replace existing articles in Ideas block.
    const groupTotal = calculateGroupTotal();
    const fragment = await fetchAndBuildIdeas({
        tagName: selectedFilters,
        maxArticles: initialMaxIdeas(features?.length ?? 0, groupTotal),
        gridItemClass: layoutType === 'two-up' ? 'grid-item--50' : 'grid-item--25',
        hasHorizontalScroll: false,
    });
    const hasArticles = (fragment.childElementCount > 0);
    const isEndOfArticles = fragment.lastChild === null || fragment.lastChild?.dataset?.lastArticle === "true";

    // Replace existing articles with new articles + existing features.
    // Append to fragment and rearrange, then update in one operation.
    fragment.append(fragment, ...features);
    rearrangeFeatures(fragment, groupTotal);
    ideasGrid.replaceChildren(fragment);

    // Show or hide load more button.
    if (loadMoreButton) {
        if (isEndOfArticles) {
            loadMoreButton.disabled = true;
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.disabled = false;
            loadMoreButton.removeAttribute('style');
            loadMoreButton.dataset.isLoading = false;
            loadMoreButton.textContent = loadMoreButton.dataset.defaultText;
        }
    }

    // Show or hide no results text.
    if (noResultsElement) {
        noResultsElement.style.display = hasArticles ? 'none' : 'block';
    }

    // Update live region text to announce filter change to screen readers.
    if (liveRegion) {
        if (selectedFilters.length === 0) {
            liveRegion.textContent = 'The ideas list has refreshed to show all articles';
        } else {
            liveRegion.textContent = `The ideas list has refreshed to show articles tagged as: ${selectedFilters.join(', ')}`;
        }
    }
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

    // All filter button elements.
    const filterButtons = filterGroup.querySelectorAll('.filter-group__button');
    if (filterButtons.length === 0) return;
    const allButton = filterButtons[0];

    // State of the clicked button and whether it's the special "All" filter reset.
    const isSelected = clickedButton.getAttribute('aria-pressed') === 'true';
    const isAllFilter = clickedButton.isSameNode(allButton);

    if (isAllFilter) {
        // "All" filter -----
        // Does nothing if already selected.
        if (isSelected) return;
        // Set all other filters as unselected when "All" is selected.
        filterButtons.forEach((btn) => {
            updateFilter(btn, false);
        });
        updateFilter(clickedButton, true);
    } else {
        // Regular filters -----
        // Set filter as selected, and deselect "All" if it was selected.
        updateFilter(clickedButton, !isSelected);

        // Update state of "All" filter:
        // - If at least one filter is selected, "All" gets deselected.
        // - In the case that the only selected filter was just deselected, set "All" back to selected.
        const hasRegularFilterSelected = Array.from(filterButtons).slice(1).some(
            button => button.getAttribute('aria-pressed') === 'true'
        );
        updateFilter(allButton, !hasRegularFilterSelected);
    }

    // Update array of selected filters, and refresh articles displayed on page.
    const selectedFilters = getCurrentFiltersArray(filterGroup);
    filterGroup.dataset.selectedFilters = selectedFilters;
    debounce(() => refreshArticleContent(selectedFilters), 50)();
};
