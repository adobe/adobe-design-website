import { dataStore, debounce } from "../../scripts/helpers/index.js";

const searchParams = new URLSearchParams(window.location.search);
const SEARCH_INPUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" roll="img"><path fill="currentColor" d="M16.9 15.5c2.4-3.2 2.2-7.7-.7-10.6-3.1-3.1-8.1-3.1-11.3 0-3.1 3.2-3.1 8.3 0 11.4 2.9 2.9 7.5 3.1 10.6.6v.1l4.2 4.2c.5.4 1.1.4 1.5 0 .4-.4.4-1 0-1.4l-4.3-4.3zm-2.1-9.2c2.3 2.3 2.3 6.1 0 8.5-2.3 2.3-6.1 2.3-8.5 0C4 12.5 4 8.7 6.3 6.3c2.4-2.3 6.2-2.3 8.5 0z"/></svg>`;

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
    sectionName = "Pages";
  } else {
    // Default to the root directory name.
    sectionName = rootDir;

    // Custom sub-page name adjustments.
    if (sectionName === "ideas") {
      sectionName = "Articles";
    }
    if (sectionName === "careers") {
      sectionName = "Job Listings";
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
  title.className = 'search__results-title util-title-xs';
  title.textContent = result.title;

  const description = document.createElement('div');
  description.className = 'search__results-description util-body-xs';
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
 * Clear search entirely; remove from URL params and results markup.
 * @param {HTMLElement} block The main search block element.
 */
function clearSearch(block) {
  clearSearchResults(block);
  // Remove query param from URL and update browser history.
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
    if (result?.path === '/' || result?.path.startsWith('/authors/')) return;

    // Search within meta `title`, `description`, and the words in the last part of the `path`.
    const metaContents = `${result.title} ${!result.path.startsWith('/authors/') ? result.description : ''} ${result.path.split('/').pop()}`.toLowerCase();
    searchTerms.forEach((term) => {
      const idx = metaContents.indexOf(term);
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
    clearSearch(block);
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
      clearSearch(block);
    }
  });

  /**
   * Search after input into search field.
   */
  const debouncedHandleSearch = debounce((e) => handleSearch(e?.target, block, config), 200);
  searchInput.addEventListener('input', debouncedHandleSearch);

  /**
   * Kick off search if search field already has a value when it gains focus.
   */
  searchInput.addEventListener('focus', (e) => handleSearch(e?.target, block, config));

  /**
   * Handle escape being pressed on input or when focused on a result.
   */
  block.addEventListener('keyup', (e) => {
    // Collapse and clear search after pressing Escape.
    if (e.code === 'Escape') {
      box.classList.remove('search__box--expanded');
      toggleButton.toggleAttribute('aria-expanded');
      clearSearch(block);
    }
  });

  /**
   * Collapse and clear search after clicking somewhere else.
   */
  document.addEventListener('click', (e) => {
    const collapseAndClear = () => {
      box.classList.remove('search__box--expanded');
      clearSearch(block);
    };

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
