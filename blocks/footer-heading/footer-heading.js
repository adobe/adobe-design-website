import { logoSVG } from './logosvg.js';

/**
 * Loads and decorates the footer heading.
 * @function
 * @param {Element} block The block element
 * @returns {Element}
 */

export default function decorate(block) {
  block.parentElement.classList.add('footer-heading');

  // create the homepage link
  const headingLink = document.createElement('a');
  const headingLinkText = block.children[0].children[0].innerText;
  const headingLinkURL = block.children[0].children[1].innerText;

  headingLink.innerHTML = `
    <span class="util-visually-hidden">${headingLinkText}</span>
    ${logoSVG}
  `;
  headingLink.href = headingLinkURL;
  headingLink.classList.add('footer-heading__link');

  // add the description to a paragraph tag
  const headingDescription = document.createElement('p');
  const headingDescriptionText = block.children[1].children[0].innerText;

  headingDescription.innerHTML = headingDescriptionText;

  // put it all together

  block.replaceWith(headingLink, headingDescription);
}
