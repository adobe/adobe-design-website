import { buildListingDetails } from "../blocks-helpers/listingDetails.js";
import { buildListingCTA } from '../blocks-helpers/listingCTA.js';
import { loadListingPreFooter } from '../blocks-helpers/listingPreFooter.js';

export const buildCareersListingPage = async () => {
  const listing = document.querySelector('#main-content > .section > div');
  listing.classList.add('util-listing-container');
  const listingHeader = listing.querySelector('h1');
  const listingDetails = buildListingDetails();
  const listingCTA = buildListingCTA();
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
  const horizontalRuleWrapper = document.createElement('div');
  horizontalRuleWrapper.classList.add('horizontal-rule-wrapper', 'util-hide-at-large');
  const horizontalRule = document.createElement('hr');
  horizontalRule.classList.add('horizontal-rule');
  horizontalRuleWrapper.append(horizontalRule);

  // Add horizontal rule between listing and prefooter
  const fullHorizontalRuleWrapper = document.createElement('div');
  horizontalRuleWrapper.classList.add('horizontal-rule-wrapper');
  const fullHorizontalRule = document.createElement('hr');
  fullHorizontalRule.classList.add('horizontal-rule', 'horizontal-rule--full');
  fullHorizontalRuleWrapper.append(fullHorizontalRule);

  listing.after(listingCTA);
  listingCTA.after(listingPreFooter);
  listingPreFooter.before(fullHorizontalRuleWrapper);
  listingHeader.after(listingDetails);
  listingDetails.after(horizontalRuleWrapper);
  horizontalRuleWrapper.after(listingMainContentContainer);

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
