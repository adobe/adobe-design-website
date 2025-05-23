/**
 * Retrieves the repeatable copy for listing prefooter from the partials directory on Sharepoint
 *
 * @function
 * @return {string} an HTML <section> node
 */

export const loadListingPreFooter = async () => {
  const resp = await fetch('/partials/career-listing-prefooter.plain.html');

  if (resp.ok) {
    const prefooterContainer = document.createElement('section');
    prefooterContainer.classList.add('util-listing-prefooter');
    prefooterContainer.innerHTML = await resp.text();

    return prefooterContainer;
  };

  return null;
}
