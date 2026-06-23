import { dataStore } from "../../scripts/helpers/index.js";
import { filterData, getSearchTermsArray, sectionNameFromPath } from "../search/search.js";
import { loadFragment } from '../fragment/fragment.js';
import { buildCard } from "../card/card.js";

/* Path to page containing the content displayed when there are no results. */
const noSearchResultsPartial = '/partials/no-search-results';

/**
 * Build grid of search results from returned data.
 * 
 * @param {object} results Results of search.
 * @returns {HTMLUListElement}
 */
const buildResultsGrid = (results) => {
  // Parent list of all results.
  const resultsList = document.createElement('ul');
  resultsList.classList.add('search-results__list', 'grid-container');

  // Build and append a card for each result.
  results.forEach((result) => {
    const sectionName = sectionNameFromPath(result.path, result?.author);
    const hasImage = sectionName == "Article" && result?.image;

    // Create base card markup.
    const card = buildCard(
      {
        img: hasImage ? (result?.image?.trim() ?? '') : '',
        textContent: [
            result?.title ?? '',
            result?.description ?? ''
        ],
        url: result.path,
      },
      'li'
    );

    // Adjust card markup.
    card.classList.add('grid-item', 'grid-item--25', 'search-results__item');

    // Append Badge with publication date.
    if (result?.publicationDate) {
      const cardContent = card.querySelector('.card__content');
      if (!cardContent) return;
      // Convert Excel serial date (e.g. "45981") to Date object that can be displayed.
      const publicationDate = new Date(Date.UTC(0, 0, parseInt(result.publicationDate) - 1));
      const badge = document.createElement('p');
      badge.classList.add('search-results__badge');
      badge.textContent = publicationDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });

      // Have screen readers pause after reading the date.
      const srOnlyPause = document.createElement('span');
      srOnlyPause.classList.add('util-visually-hidden');
      srOnlyPause.textContent = ".";
      badge.append(srOnlyPause);

      cardContent.prepend(badge);
    }

    // Append card to parent list.
    resultsList.append(card);
  });

  return resultsList;
}

/**
 * Search results page block
 * 
 * - Fetches search results data and displays in a grid.
 * - If there are no results, displays page content from a partial.
 * 
 * @param {Element} block
 */
export default function decorate(block) {
  const settings = {
    headingResults: block.children?.[0]?.children?.[0]?.children,
    headingNoResults: block.children?.[1]?.children?.[0]?.children,
    resultText: block.children?.[3]?.children?.[0]?.textContent?.trim() ?? "Result",
    resultTextPlural: block.children?.[3]?.children?.[1]?.textContent?.trim() ?? "Results",
  };

  const blockContainer = document.createElement('div');
  blockContainer.classList.add('search-results');

  const header = document.createElement('div');
  header.classList.add('search-results__header');
  blockContainer.append(header);

  // Append all new markup to empty parent div.
  block.parentElement.replaceWith(blockContainer);

  // Fetch results.
  const searchParams = new URLSearchParams(window.location.search);
  const searchValue = searchParams.get('q')?.trim() ?? '';
  const searchTerms = getSearchTermsArray(searchValue);
  
  (async () => {
    // Query all data and search it. Only search articles.
    const allFetchedData = await dataStore.getData(dataStore.commonEndpoints.ideas);
    const results = filterData(searchTerms, allFetchedData?.data);
    const hasResults = results && results.length > 0;

    // Header above results.
    const headerText = hasResults ? settings.headingResults : settings.headingNoResults;
    for (const child of headerText ?? []) {
      // Replace constant in content with actual search term.
      child.textContent = child.textContent.replace("[SEARCH_TERMS]", searchValue);
    }
    header.append(...headerText);

    // No results. ----
    if (!hasResults) {
      // Display page content from partial. Append sections beside existing section(s).
      const fragment = await loadFragment(noSearchResultsPartial);
      while (fragment?.firstChild) {
        blockContainer.parentElement.parentElement.append(fragment.firstChild);
      };
      return;
    }

    // Has results. ----

    // Total number of results indicator.
    const resultsTotal = document.createElement('p');
    resultsTotal.classList.add('search-results__total');
    resultsTotal.textContent = `${results.length} ${results.length == 1 ? settings.resultText : settings.resultTextPlural}`;
    blockContainer.append(resultsTotal);

    // Build search results grid.
    const resultsGrid = buildResultsGrid(results, 'h2');
    blockContainer.append(resultsGrid);
  })();
}
