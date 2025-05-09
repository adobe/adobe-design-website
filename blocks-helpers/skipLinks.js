export const buildSkipLink = () => {
  const skipToContentLink = document.createElement('a');
  skipToContentLink.href = "#main-content";
  skipToContentLink.classList.add('util-skip-link');
  skipToContentLink.innerText = "Skip to main content";

  return skipToContentLink;
}
