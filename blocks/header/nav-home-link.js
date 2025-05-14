import { logoSVG } from '../header/logosvg.js';

/**
 * creates a styled logo link from a provided set of text and url
 * @param {Element} anchorNode the homepage header link
 * @returns {Element}
 */

export const buildHomePageLink = (anchorNode) => {
  const headingLink = document.createElement('a');
  const headingLinkText = anchorNode.innerText.trim();
  const headingLinkURL = anchorNode.href;

  headingLink.innerHTML = `
    <span class="util-visually-hidden">${headingLinkText}</span>
    ${logoSVG}
  `;

  headingLink.href = headingLinkURL;
  headingLink.classList.add('nav__home-link');

  return headingLink;
}
