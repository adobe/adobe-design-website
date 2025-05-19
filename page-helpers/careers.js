import { buildListingDetails } from "../blocks-helpers/listingDetails.js";

export const buildCareersListingPage = () => {
  const listing = document.querySelector('#main-content > .section > div');
  listing.classList.add('util-listing-container');
  const listingHeader = listing.querySelector('h1');
  const listingDetails = buildListingDetails();

  const listingMainContent = [...listing.children].filter(
    (child) => child !== listingHeader && child !==listingDetails
  );
  const listingMainContentContainer = document.createElement('div');
  listingMainContentContainer.classList.add('util-listing-content');
  listingMainContent.forEach(
    (child) => listingMainContentContainer.append(child)
  );

  const horizontalRuleWrapper = document.createElement('div');
  horizontalRuleWrapper.classList.add('horizontal-rule-wrapper', 'util-hide-at-large');
  const horizontalRule = document.createElement('hr');
  horizontalRule.classList.add('horizontal-rule');
  horizontalRuleWrapper.append(horizontalRule);

  listingHeader.after(listingDetails);
  listingDetails.after(horizontalRuleWrapper);
  horizontalRuleWrapper.after(listingMainContentContainer);
}
