/**
 * Builds a bypass block that links to the page's main content element.
 * @function
 * @return {string} a static HTML anchor node
 */

export const buildSkipLink = () => {
  const skipToContentLink = document.createElement('a');
  skipToContentLink.href = "#main-content";
  skipToContentLink.classList.add('util-skip-link');
  skipToContentLink.innerText = "Skip to main content";

  return skipToContentLink;
}
