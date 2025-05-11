import {
  fetchPlaceholders,
} from '../../scripts/aem.js';

const searchParams = new URLSearchParams(window.location.search);

const SEARCH_INPUT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" roll="img"><path fill="currentColor" d="M16.9 15.5c2.4-3.2 2.2-7.7-.7-10.6-3.1-3.1-8.1-3.1-11.3 0-3.1 3.2-3.1 8.3 0 11.4 2.9 2.9 7.5 3.1 10.6.6v.1l4.2 4.2c.5.4 1.1.4 1.5 0 .4-.4.4-1 0-1.4l-4.3-4.3zm-2.1-9.2c2.3 2.3 2.3 6.1 0 8.5-2.3 2.3-6.1 2.3-8.5 0C4 12.5 4 8.7 6.3 6.3c2.4-2.3 6.2-2.3 8.5 0z"/></svg>`;

function findNextHeading(el) {
  let preceedingEl = el.parentElement.previousElement || el.parentElement.parentElement;
  let h = 'H2';
  while (preceedingEl) {
    const lastHeading = [...preceedingEl.querySelectorAll('h1, h2, h3, h4, h5, h6')].pop();
    if (lastHeading) {
      const level = parseInt(lastHeading.nodeName[1], 10);
      h = level < 6 ? `H${level + 1}` : 'H6';
      preceedingEl = false;
    } else {
      preceedingEl = preceedingEl.previousElement || preceedingEl.parentElement;
    }
  }
  return h;
}

export async function fetchData(source) {
  const response = await fetch(source);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading API response', response);
    return null;
  }

  const json = await response.json();
  if (!json) {
    // eslint-disable-next-line no-console
    console.error('empty API response', source);
    return null;
  }

  return json.data;
}

function renderResult(result) {
  const li = document.createElement('li');
  li.className = 'search__results-item';

  const a = document.createElement('a');
  a.href = result.path;

  const title = document.createElement('div');
  title.className = 'search__results-title util-title-xs';
  title.textContent = result.title;

  const description = document.createElement('div');
  description.className = 'search__results-description util-body-s';
  description.textContent = result.description;

  a.append(title, description);
  li.appendChild(a);
  return li;
}

function clearSearchResults(block) {
  const searchResults = block.querySelector('.search__results');
  searchResults.innerHTML = '';
}

function clearSearch(block) {
  clearSearchResults(block);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }
}

async function renderResults(block, config, filteredData) {
  clearSearchResults(block);
  const searchResults = block.querySelector('.search__results');

  if (filteredData.length) {
    searchResults.classList.remove('search__results--no-results');
    filteredData.forEach((result) => searchResults.append(renderResult(result)));
  } else {
    const noResultsMessage = document.createElement('li');
    searchResults.classList.add('search__results--no-results');
    noResultsMessage.textContent = config.placeholders.searchNoResults || 'No results found.';
    searchResults.append(noResultsMessage);
  }
}

function compareFound(hit1, hit2) {
  return hit1.minIdx - hit2.minIdx;
}

function filterData(searchTerms, data) {
  const foundInHeader = [];
  const foundInMeta = [];

  data.forEach((result) => {
    let minIdx = -1;

    searchTerms.forEach((term) => {
      const idx = (result.header || result.title).toLowerCase().indexOf(term);
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (minIdx >= 0) {
      foundInHeader.push({ minIdx, result });
      return;
    }

    const metaContents = `${result.title} ${result.description} ${result.path.split('/').pop()}`.toLowerCase();
    searchTerms.forEach((term) => {
      const idx = metaContents.indexOf(term);
      if (idx < 0) return;
      if (minIdx < idx) minIdx = idx;
    });

    if (minIdx >= 0) {
      foundInMeta.push({ minIdx, result });
    }
  });

  return [
    ...foundInHeader.sort(compareFound),
    ...foundInMeta.sort(compareFound),
  ].map((item) => item.result);
}

async function handleSearch(e, block, config) {
  const searchValue = e.target.value.trim();
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

  const searchTerms = searchValue.toLowerCase().split(/\s+/).filter((term) => !!term);

  const data = await fetchData(config.source);
  const filteredData = filterData(searchTerms, data);
  await renderResults(block, config, filteredData, searchTerms);
}

function searchResultsContainer(block) {
  const results = document.createElement('ul');
  results.className = 'search__results';
  results.dataset.h = findNextHeading(block);
  return results;
}

function searchBox(block, config) {
  const box = document.createElement('div');
  box.classList.add('search__box');

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search__input-wrapper';

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.className = 'search__input';
  const searchPlaceholder = config.placeholders.searchPlaceholder || 'Search';
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

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search__results-container';
  const searchResults = searchResultsContainer(block);
  resultsContainer.appendChild(searchResults);

  searchInput.append(searchIconInInput);
  inputWrapper.append(searchInput);

  box.append(inputWrapper, toggleButton, resultsContainer);

  toggleButton.addEventListener('click', () => {
    box.classList.toggle('search__box--expanded');
    toggleButton.toggleAttribute('aria-expanded');
    if (box.classList.contains('search__box--expanded')) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      clearSearch(block);
    }
  });

  searchInput.addEventListener('input', (e) => {
    handleSearch(e, block, config);
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      box.classList.remove('search__box--expanded');
      toggleButton.toggleAttribute('aria-expanded');
      searchInput.value = '';
      clearSearch(block);
    }
    // if (e.code === 'Enter') {
    //   window.location.href = `/search-results?q=${encodeURIComponent(searchInput.value)}`;
    // }
  });

  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && box.classList.contains('search__box--expanded')) {
      box.classList.remove('search__box--expanded');
      clearSearch(block);
    }
  });

  return box;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  //!! TODO: handle search functionality
  const source = block.querySelector('a[href]') ? block.querySelector('a[href]').href : './sample-search-data/query-index.json';
  block.innerHTML = '';
  block.append(
    searchBox(block, { source, placeholders }),
    searchResultsContainer(block),
  );

  if (searchParams.get('q')) {
    const input = block.querySelector('input');
    input.value = searchParams.get('q');
    input.dispatchEvent(new Event('input'));
  }
}
