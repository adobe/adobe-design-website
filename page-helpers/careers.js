import { getListingMetadata } from "../blocks-helpers/getListingMetadata.js";
import { buildListingDetails } from "../blocks-helpers/listingDetails.js";
import { buildListingCTA } from '../blocks-helpers/listingCTA.js';
import { loadListingPreFooter } from '../blocks-helpers/listingPreFooter.js';

export const buildCareersListingPage = async () => {
  const listingMetadata = getListingMetadata();

  const listing = document.querySelector('#main-content > .section > div');
  listing.classList.add('util-listing-container');
  const listingHeader = listing.querySelector('h1');
  const listingDetails = buildListingDetails(listingMetadata);
  const listingCTA = buildListingCTA(listingMetadata);
  const listingPreFooter = await loadListingPreFooter();

  // Wrap main content of career listing in its own container for grid layout
  const listingMainContent = [...listing.children].filter(
    (child) => child !== listingHeader && child !==listingDetails
  );
  const listingMainContentContainer = document.createElement('div');
  listingMainContentContainer.classList.add('util-listing-content');
  listingMainContent.forEach(
    (child) => listingMainContentContainer.append(child)
  );

  // Add horizontal rule between listing details and main content
  const horizontalRule = document.createElement('hr');
  horizontalRule.classList.add('horizontal-rule', 'util-hide-at-large');

  // Add horizontal rule between listing and prefooter
  const fullHorizontalRule = document.createElement('hr');
  fullHorizontalRule.classList.add('horizontal-rule', 'horizontal-rule--full');

  listing.after(listingCTA);
  listingCTA.after(listingPreFooter);
  listingPreFooter.before(fullHorizontalRule);
  listingHeader.after(listingDetails);
  listingDetails.after(horizontalRule);
  horizontalRule.after(listingMainContentContainer);

  // Listing CTA only visible after scrolling past career details
  window.addEventListener('scroll', () => {
    const revealListingCTAPosition = listingDetails.getBoundingClientRect().bottom;

    if (revealListingCTAPosition < 0) {
      listingCTA.classList.remove('util-visually-hidden');
    } else {
      listingCTA.classList.add('util-visually-hidden');
    };
  });
}
