
import { updateFilter } from './filter-group-utils.js';
import { handleFilterClick } from './filter-group-functions.js';

/*
 * Filter Group Block
 * A set of multi-select tag buttons that filter which articles are displayed.
 */
export default async function decorate(block) {
    const wrapper = block.parentElement;
    wrapper.classList.add('filter-group');
    wrapper.dataset.blockName = 'filter-group';

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
}
