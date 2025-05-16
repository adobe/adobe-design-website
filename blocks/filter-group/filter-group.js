import { dataStore } from '../../scripts/dataStore.js';

/**
 * Update selected state of filter button.
 * @param {HTMLButtonElement} buttonElement 
 * @param {boolean} newSelected New selected state
 */
const updateFilter = (buttonElement, newSelected = false) => {
    buttonElement.classList.toggle('filter-group__button--selected', newSelected);
    buttonElement.setAttribute('aria-pressed', newSelected ? 'true' : 'false');
};

/**
 * Get an array containing the text value of all selected filters.
 * When "All" is selected, this returns an empty array.
 * @param {Element} parentElement 
 * @returns {string[]}
 */
const getCurrentFiltersArray = (parentElement) => Array.from(
    parentElement.querySelectorAll('.filter-group__button:not(:first-of-type)[aria-pressed="true"]'), btn => btn.textContent
) || [];

/**
 * TO-DO: remove this when ideas page content and functionality is finalized.
 * 
 * It's intended for data-tags to be applied to cards of dynamically loaded ideas articles.
 * This mocks up what tags are applied per placeholder card element on the Ideas page.
 */
const applyTemporaryMockupTags = () => {
    if (window.location.pathname != '/ideas/') return;

    const mockupTagsAppliedToCards = [
        'Design Research,Generative AI Design',
        'Design Systems,Design Process',
        'Design Systems,Design Leadership',
        'Design Strategy',
        'Generative AI Design',
    ];

    document.querySelectorAll('.card')?.forEach((card, i) => {
        if (mockupTagsAppliedToCards.length < i) {
            card.dataset.tags = 'Design Stategy';
            return;
        }
        card.dataset.tags = mockupTagsAppliedToCards[i];
    });
}

/**
 * TO-DO: work with real Ideas page content. This function is currently mockup/placeholder functionality
 * and will likely need to be moved to the ideas/stories feed block.
 * 
 * Update all articles displayed on the page with ones that have tags
 * that match the currently selected filters.
 */
const refreshArticleContent = (selectedFilters = []) => {
    // TO-DO: remove this when ideas page content and functionality is finalized.
    applyTemporaryMockupTags();

    // Show/hide article cards based on selected tags.
    document.querySelectorAll('.card')?.forEach(article => {
        // "All" reset. Display all articles.
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
 * @param {PointerEvent} event
 */
const handleFilterClick = function (event) {
    const filterGroup = this;
    const clickedButton = event.target.closest('.filter-group__button');
    if (!clickedButton) return;

    // State of button and whether it's the special "All" filter reset.
    const isSelected = clickedButton.getAttribute('aria-pressed') == 'true';
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

/**
 * Remove filter buttons for tags that are not assigned to any articles.
 */
const removeUnusedTags = async (parentElement) => {
    const allArticles = await dataStore.getData(dataStore.commonEndpoints.queryIndex);
    if (allArticles?.data?.length > 0) {
        parentElement.querySelectorAll('.filter-group__button:not(:first-of-type)').forEach((btn) => {
            if (!allArticles?.data?.some(article => article?.tag && btn.textContent === article.tag)){
                btn.remove();
            }
        });
    }
}

/*
 * Filter Group Block
 * A set of multi-select tag buttons that filter which articles are displayed.
 */
export default async function decorate(block) {
    const wrapper = block.parentElement;
    wrapper.classList.add('filter-group-wrapper');

    // Create text label above the filters.
    // An aria-label is included to provide a little more explanation of the functionality for screen readers.
    const label = document.createElement('div');
    label.className = 'filter-group__label util-body-s';
    label.id = 'filter-group-label';
    label.textContent = 'Filter articles:';
    label.setAttribute('aria-label', 'Select one or more tags to filter the list of articles by. The "All" filter will reset any selections and display all articles.');

    // Create container for all of the filter buttons.
    // This houses the main event listeners for the functionality.
    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group__list';
    filterGroup.setAttribute('role', 'group');
    filterGroup.setAttribute('aria-label', 'Filter options');
    filterGroup.setAttribute('aria-describedby', 'filter-group-label');
    filterGroup.id = 'filter-group';
    filterGroup.dataset.selectedFilters = '';
    filterGroup.addEventListener('click', handleFilterClick);

    // The block content rows (single column) contain the text for all of the filter buttons. 
    const filters = [...block.children].map((child) => child.firstElementChild);

    /**
     * Create a single filter button.
     * @param {string} buttonText 
     * @param {boolean} isSelected 
     * @returns HTMLButtonElement
     */
    const createFilterButton = (buttonText, isSelected = false) => {
        const button = document.createElement('button');
        button.className = 'filter-group__button util-detail-m';
        button.textContent = buttonText;
        button.setAttribute('type', 'button');
        updateFilter(button, isSelected);
        return button;
    }

    // Create all of the filter buttons.
    // The "All" button is added automatically as the first filter.
    filterGroup.appendChild(createFilterButton('All', true));
    filters.forEach(filter => {
        if (filter.textContent == "All") return;
        filterGroup.appendChild(createFilterButton(filter.textContent, false));
    });

    // Replace block with newly built elements.
    wrapper.replaceChildren(label, filterGroup);

    // Remove filter buttons not in the list of articles.
    // Don't wait for this async operation so it's not render blocking.
    removeUnusedTags(wrapper);
}
