import { dataStore, debounce } from "../../scripts/helpers/index.js";

const searchParams = new URLSearchParams(window.location.search);
const SEARCH_INPUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" roll="img"><path fill="currentColor" d="M16.9 15.5c2.4-3.2 2.2-7.7-.7-10.6-3.1-3.1-8.1-3.1-11.3 0-3.1 3.2-3.1 8.3 0 11.4 2.9 2.9 7.5 3.1 10.6.6v.1l4.2 4.2c.5.4 1.1.4 1.5 0 .4-.4.4-1 0-1.4l-4.3-4.3zm-2.1-9.2c2.3 2.3 2.3 6.1 0 8.5-2.3 2.3-6.1 2.3-8.5 0C4 12.5 4 8.7 6.3 6.3c2.4-2.3 6.2-2.3 8.5 0z"/></svg>`;
const SEARCH_CLEAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" focusable="false" aria-hidden="true" role="img"><path fill="currentColor" d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path></svg>`;

// Root directory names for main sections (without slashes).
const articleRoot = "ideas";
const authorRoot = "authors";
const jobListingRoot = "careers";

/**
 * Create section name to be used for descriptive text under search result title.
 * @param {string} path 
 * @return {string}
 */
function sectionNameFromPath(path) {
  const pathParts = path?.split('/');
  const rootDir = pathParts?.[1] ?? '';

  let sectionName = '';
  if (pathParts.length < 3 || path.endsWith('/')) {
    // Landing or single pages
    sectionName = "Page";
  } else {
    // Default to the root directory name.
    sectionName = rootDir;

    // Custom sub-page name adjustments.
    if (sectionName === articleRoot) {
      sectionName = "Article";
    }
    if (sectionName === jobListingRoot) {
      sectionName = "Job Listing";
    }
  }

  return sectionName;
}

/**
 * Create the markup for a single search result.
 * @param {object} result
 * @returns {HTMLLIElement}
 */
function renderResult(result) {
  const li = document.createElement('li');
  li.className = 'search__results-item';

  const a = document.createElement('a');
  a.href = result.path;

  const title = document.createElement('div');
  title.className = 'search__results-title util-title-s';
  title.textContent = result.title;

  const description = document.createElement('div');
  description.className = 'search__results-description util-body-s';
  const descriptionText = sectionNameFromPath(result.path);
  if (descriptionText) description.textContent = descriptionText;

  a.append(title, description);
  li.appendChild(a);
  return li;
}

/**
 * Remove search results markup from its container.
 */
function clearSearchResults(block) {
  const searchResults = block.querySelector('.search__results');
  searchResults.innerHTML = '';
}

/**
 * Clear search from URL params and update history.
 */
function clearSearchURLParam() {
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Create and append all search results markup based on the data.
 */
async function renderResults(block, config, filteredData) {
  clearSearchResults(block);
  const searchResults = block.querySelector('.search__results');

  if (filteredData?.length) {
    // Has results; append results to container.
    searchResults.classList.remove('search__results--no-results');
    filteredData.forEach((result) => searchResults.append(renderResult(result)));
  } else {
    // No results; display message.
    const noResultsMessage = document.createElement('li');
    searchResults.classList.add('search__results--no-results');
    noResultsMessage.textContent = config?.placeholders?.searchNoResults || 'No results found.';
    searchResults.append(noResultsMessage);
  }
}

/**
 * Compare function for used by Array.sort on search results from `filterData`.
 * Sorts by the `minIdx` property, smallest to largest, i.e. when searched text
 * is found closer to the start of the searched text, it appears in results first. 
 * @param {object} hit1
 * @param {object} hit2 
 * @returns 
 */
function compareFound(hit1, hit2) {
  return hit1.minIdx - hit2.minIdx;
}

/**
 * Searches data for search terms and returns data with matches.
 * @param {string[]} searchTerms 
 * @param {object} data 
 * @returns 
 */
function filterData(searchTerms, data) {
  const foundInMeta = [];

  data?.forEach((result) => {
    // Position of the first instance of the searched text substring.
    let minIdx = -1;

    // Leave home page and author pages off of results.
    if (result?.path === '/' || result?.path.startsWith("/" + authorRoot + "/")) return;

    // Search within meta `title`, `description`, the words in the last part of the `path`, and the author name on articles.
    const textToSearch = `${result.title} ${result.description} ${result.path.split('/').pop()} ${result.path.startsWith("/" + articleRoot + "/") ? result.author : ''}`.toLowerCase();
    searchTerms.forEach((term) => {
      const idx = textToSearch.indexOf(term);
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (minIdx >= 0) {
      foundInMeta.push({ minIdx, result });
    }
  });

  return foundInMeta.sort(compareFound).map((item) => item.result);
}

/**
 * Initiate search functionality and displays results.
 * Only searches if inputted text has 3 characters or more.
 * @param {HTMLInputElement} inputElement 
 * @param {HTMLElement} block 
 * @param {object} config
 */
async function handleSearch(inputElement, block, config) {
  if (!inputElement) return;
  const searchValue = inputElement.value.trim();
  searchParams.set('q', searchValue);

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  if (searchValue.length < 3) {
    clearSearchResults(block);
    clearSearchURLParam();
    return;
  }

  // Array of unique search terms from the search string (that were separated by a space).
  const searchTerms = searchValue.toLowerCase().split(/\s+/).filter((term) => !!term);

  // Query data, search it, and render the results.
  const results = await dataStore.getData(config.source);
  const filteredData = filterData(searchTerms, results?.data);
  await renderResults(block, config, filteredData, searchTerms);
}

/**
 * Create container with a list for search results.
 * @returns {HTMLDivElement}
 */
function createSearchResultsContainer() {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search__results-container';
  const resultsList = document.createElement('ul');
  resultsList.className = 'search__results';
  resultsContainer.appendChild(resultsList);
  return resultsContainer;
}

/**
 * Create search markup, and add its event listeners.
 * @returns {HTMLDivElement}
 */
function createSearchBox(block, config) {
  const box = document.createElement('div');
  box.classList.add('search__box');

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search__input-wrapper';

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.name = 'search';
  searchInput.className = 'search__input';
  const searchPlaceholder = config?.placeholders?.searchPlaceholder || 'Search';
  searchInput.placeholder = searchPlaceholder;
  searchInput.setAttribute('aria-label', searchPlaceholder);

  const searchIconInInput = document.createElement('span');
  searchIconInInput.classList.add('icon', 'search__search-icon');
  searchIconInInput.innerHTML = SEARCH_INPUT_ICON;

  const toggleButton = document.createElement('button');
  toggleButton.classList.add('search__button');
  toggleButton.setAttribute('type', 'button');
  toggleButton.setAttribute('aria-label', 'Toggle search');
  toggleButton.innerHTML = searchIconInInput.innerHTML;

  const resultsContainer = createSearchResultsContainer();

  searchInput.append(searchIconInInput);
  inputWrapper.append(searchInput);

  // Clear button.
  const clearButton = document.createElement('button');
  clearButton.ariaLabel = "Clear search";
  clearButton.classList.add("search__clear-button");
  clearButton.tabIndex = "-1";
  clearButton.innerHTML = SEARCH_CLEAR_ICON;
  inputWrapper.append(clearButton);

  box.append(inputWrapper, toggleButton, resultsContainer);

  /**
   * Clicking the search icon toggles the expanded search field.
   */
  toggleButton.addEventListener('click', () => {
    box.classList.toggle('search__box--expanded');
    toggleButton.toggleAttribute('aria-expanded');
    if (box.classList.contains('search__box--expanded')) {
      searchInput.focus();
    } else {
      clearSearchResults(block);
      clearSearchURLParam();
    }
  });

  /**
   * Search after input into search field.
   */
  const debouncedHandleSearch = debounce((e) => handleSearch(e?.target, block, config), 200);
  searchInput.addEventListener('input', debouncedHandleSearch);
  searchInput.addEventListener('input', () => {
    searchInput.classList.toggle('search__input--populated', Boolean(searchInput.value.length))
  });

  /**
   * Kick off search if search field already has a value when it gains focus.
   */
  searchInput.addEventListener('focus', (e) => handleSearch(e?.target, block, config));

  /**
   * Handle escape or clear button. Optional collapse, clear search value, and clear search results.
   * 
   * @param {boolean} collapseExpanded Whether to collapse the expanded large screen search.
   */
  const handleClearEvent = (collapseExpanded = false) => {
    if (collapseExpanded){
      box.classList.remove('search__box--expanded');
      toggleButton.toggleAttribute('aria-expanded', false);
    }
    searchInput.value = '';
    searchInput.classList.remove('search__input--populated');
    clearSearchResults(block);
    clearSearchURLParam();
  };

  /**
   * Handle escape being pressed on input or when focused on a result.
   */
  block.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      handleClearEvent(false);
    }
  });

  /**
   * Go to search results page if enter is pressed while the input is focused.
   */
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      window.location.href = `/search-results?q=${encodeURIComponent(searchInput.value)}`;
    }
  });

  /**
   * Handle click on clear button.
   */
  clearButton.addEventListener('click', (e) => {
    e.stopPropagation();
    handleClearEvent(false);
  });

  /**
   * Collapse expanded search and clear search results.
   */
  const collapseAndClear = () => {
    box.classList.remove('search__box--expanded');
    toggleButton.toggleAttribute('aria-expanded', false);
    clearSearchResults(block);
    clearSearchURLParam();
  };

  /**
   * Collapse and clear search after clicking somewhere else.
   */
  document.addEventListener('click', (e) => {
    if (box.closest('.nav')?.classList.contains('nav--large-screens')) {
      if (!box.contains(e.target) && box.classList.contains('search__box--expanded')) {
        collapseAndClear();
      }
    } else {
      if (inputWrapper !== e.target && !inputWrapper.contains(e.target) && resultsContainer !== e.target && !resultsContainer.contains(e.target)) {
        collapseAndClear();
      }
    }
  });

  /**
   * Make sure change in keyboard (tab) focus to another element outside of search also clears the search results.
   * Important for mobile menu focus moving from search to the nav.
   */
  box.addEventListener('focusout', function(e) {
      // Check if the element that gained focus (relatedTarget) is outside the search.
      // Note: relatedTarget will be null in Safari when reaching expand/collapse button.
      if (e.relatedTarget !== null && !box.contains(e.relatedTarget)) {
        clearSearchResults(block);
      }
  }, true);

  return box;
}

/**
 * Search block
 */
export default async function decorate(block) {
  // Placeholder strings; not currently in use.
  const placeholders = {};

  // Endpoint for search data.
  const source = dataStore.commonEndpoints.queryIndex;
  
  // Build block markup.
  block.innerHTML = '';
  block.append(
    createSearchBox(block, { source, placeholders })
  );

  // Kick off search initially if it's in a query param in the URL.
  if (searchParams.get('q')) {
    const input = block.querySelector('input');
    input.value = searchParams.get('q');
    input.dispatchEvent(new Event('input'));
  }
}
