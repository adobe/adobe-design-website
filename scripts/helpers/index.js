/**
 * @file Helper and utility functions.
 */

// Fetching data
export { dataStore } from "./dataStore.js";
export { fetchAndBuildIdeas } from "./fetchAndBuildIdeas.js";
export { loadArticlePreFooter } from "./loadArticlePreFooter.js";
export { loadListingPreFooter } from "./loadListingPreFooter.js";

// Building blocks
export { blocksWithoutCSS } from "./blockSettings.js";
export { getAuthorData } from "./getAuthorData.js";
export { getListingMetadata } from "./getListingMetadata.js";
export { buildAuthorAside } from "./buildAuthorAside.js";
export { buildListingCTA } from "./buildListingCTA.js";
export { buildListingDetails } from "./buildListingDetails.js";
export { buildSkipLink } from "./buildSkipLink.js";
export { createFocusTrap } from "./createFocusTrap.js";

// Full-page logic
export { appendLiveRegion } from "./appendLiveRegion.js";
export { decorateThemeBackgroundVisuals } from "./themeBackgrounds.js";
export { buildCareersListingPage } from "./buildCareersListingPage.js";
export { buildArticlePage } from "./buildArticlePage.js";
export { buildSiteContentPage } from "./buildSiteContentPage.js";

// General helpers/utilities
export { appendCleanText } from "./appendCleanText.js";
export { debounce } from "./debounce.js";
export { isSubPageOf, isIndexPageOf } from "./isPageOf.js";
export { prepURL } from "./prepURL.js";
export { isExternalURL } from "./isExternalURL.js";
export { getCurrentBreakpoint } from "./getCurrentBreakpoint.js";
