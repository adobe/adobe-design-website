/**
 * Creates a link list node from a set of anchor elements.
 * @function
 * @param {Array} links an array of anchor elements
 * @returns {Element}
 */

export const buildPageLinks = (links) => {
  // create an unordered list wrapper
  const navLinks = document.createElement("ul");
  navLinks.classList.add("nav-page-links", "nav__page-links");

  // populate the list with list items containing our links
  links.forEach((link) => {
    const listItem = document.createElement("li");
    const anchorNode = document.createElement("a");

    anchorNode.href = link.href;
    anchorNode.innerText = link.innerText.trim();
    anchorNode.classList.add("nav-page-links__link");

    listItem.append(anchorNode);
    navLinks.append(listItem);
  });

  return navLinks;
};
