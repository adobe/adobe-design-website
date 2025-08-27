import { buildSkipLink } from '../../scripts/helpers/index.js';

/**
 * Decorates an object of links.
 * @function
 * @param {string} textContent the desired link label
 * @param {string} url the desired link href
 * @returns {Element} a set of anchor nodes
 */

const buildFooterLink = ({textContent, url}) => {
  const footerLink = document.createElement('a');
  const footerLinkText = textContent;
  const footerLinkURL = url;

  footerLink.innerHTML = footerLinkText;
  footerLink.href = footerLinkURL;

  return footerLink;
};

/**
 * Loads and decorates the footer links block.
 * @function
 * @param {Element} block The block element
 * @returns {Element}
 */

export default async function decorate(block) {
  block.parentElement.classList.add('footer-links');
  const footerLinkList = document.createElement('ul');
  footerLinkList.classList.add('footer-links__list');

  const footerLinksData = [...block.children].map(row => ({
    textContent: row.children[0].children[0].innerText,
    url: row.children[1].children[0].innerText,
  }));

  footerLinksData.forEach(row => {
    const footerLinkListItem = document.createElement('li');
    const footerLink = buildFooterLink(row);

    footerLinkListItem.append(footerLink);
    footerLinkList.append(footerLinkListItem);
  });

  const footerLinks = document.createElement('nav');
  footerLinks.append(buildSkipLink());
  footerLinks.append(footerLinkList);
  footerLinks.setAttribute("aria-label", "Footer");
  block.replaceWith(footerLinks);
}
