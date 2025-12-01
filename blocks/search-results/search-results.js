import { dataStore } from "../../scripts/helpers/index.js";
import { filterData, getSearchTermsArray, sectionNameFromPath } from "../search/search.js";
import { loadFragment } from '../fragment/fragment.js';

/* Path to page containing the content displayed when there are no results. */
const noSearchResultsPartial = '/partials/no-search-results';

/**
 * Build grid of search results from returned data.
 * 
 * @param {object} results Results of search.
 * @param {string} titleHeadingLevel Which element to create for the results item title.
 * @returns {HTMLUListElement}
 */
const buildresultsGrid = (results, titleHeadingLevel = 'h2') => {
  const resultsList = document.createElement('ul');
  resultsList.classList.add('search-results__list');

  results.forEach((result) => {
    const sectionName = sectionNameFromPath(result.path, result?.author);
    const hasImage = sectionName == "Article" && result?.image;

    const listItem = document.createElement('li');
    listItem.classList.add('search-results__item');

    const anchor = document.createElement('a');
    anchor.href = result.path;
    listItem.append(anchor);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('search-results__content');
    anchor.append(contentWrap);

    // Badge with type of result (page / article / etc).
    const badge = document.createElement('p');
    badge.classList.add('search-results__badge');
    badge.textContent = sectionName;
    contentWrap.append(badge);

    // Result title.
    const title = document.createElement(titleHeadingLevel);
    title.classList.add('util-title-xl','search-results__title');
    title.textContent = result.title;
    contentWrap.append(title);

    // Page description or job listing department and location.
    if (sectionName == "Job Listing") {
      if (result?.department) {
        const desc = document.createElement('p');
        desc.classList.add('util-body-s', 'search-results__department');
        desc.textContent = result.department;
        contentWrap.append(desc);
      }
      if (result?.location) {
        const desc = document.createElement('p');
        desc.classList.add('util-body-xs');
        desc.textContent = result.location;
        contentWrap.append(desc);
      }
    } else {
      if (result?.description) {
        const desc = document.createElement('p');
        desc.classList.add('util-body-s');
        desc.textContent = result.description;
        contentWrap.append(desc);
      }
    }

    // Image for articles.
    if (hasImage) {
      const imageWrap = document.createElement('figure');
      imageWrap.classList.add('search-results__visual');
      const image = document.createElement('img');
      image.src = result.image;
      image.alt = "";
      image.loading = "lazy";
      imageWrap.append(image);
      anchor.append(imageWrap);
    }

    resultsList.append(listItem);
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
    // Query all data and search it.
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
    const resultsGrid = buildresultsGrid(results, 'h2');
    blockContainer.append(resultsGrid);
  })();
}
