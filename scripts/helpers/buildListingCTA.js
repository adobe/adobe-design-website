/**
 * Builds a sticky CTA on a Careers Listing page, only visible on small and medium screens.
 *
 * @function
 * @return {string} an HTML <div> node
 */

export const buildListingCTA = (metadata) => {
  const content = {
    title: document.querySelector('h1').textContent,
    link: metadata.jobListing.content,
  };

  // The body needs additional margin when the listing CTA is available
  // so that the CTA doesn't block the copyright links
  document.body.classList.add("js-has-sticky-footer");

  const listingCTA = document.createElement('div');
  listingCTA.classList.add('listing-cta', 'util-visually-hidden');

  const listingCTATitle = document.createElement('span');
  listingCTATitle.classList.add('util-title-xl');
  listingCTATitle.textContent = content.title;

  const listingCTALink = document.createElement('a');
  listingCTALink.classList.add('button', 'button--accent');
  listingCTALink.textContent = 'Apply now';
  listingCTALink.href = content.link;

  listingCTA.append(listingCTATitle);
  listingCTA.append(listingCTALink);
  return listingCTA;
}
