/**
 * Builds a sticky CTA on a Careers Listing page, only visible on small and medium screens.
 *
 * @function
 * @return {string} an HTML <div> node
 */

export const buildListingCTA = () => {
  const content = {
    title: document.querySelector('h1').textContent,
    link: document.querySelector('meta[name="job-listing"]')?.content,
  };

  const listingCTA = document.createElement('div');
  listingCTA.classList.add('util-listing-cta', 'util-visually-hidden');

  const listingCTATitle = document.createElement('span');
  listingCTATitle.classList.add('util-title-xl');
  listingCTATitle.textContent = content.title;
  
  const listingCTALink = document.createElement('a');
  listingCTALink.classList.add('button', 'button--accent');
  listingCTALink.textContent = 'Apply now';
  listingCTALink.href = content.title;

  listingCTA.append(listingCTATitle);
  listingCTA.append(listingCTALink);
  return listingCTA;
}
