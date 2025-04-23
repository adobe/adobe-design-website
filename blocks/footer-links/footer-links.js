import { buildSkipLink } from '../../blocks-helpers/skipLinks.js';

const buildFooterLink = ({textContent, url}) => {
  const footerLink = document.createElement('a');
  const footerLinkText = textContent;
  const footerLinkURL = url;

  footerLink.innerHTML = footerLinkText;
  footerLink.href = footerLinkURL;

  return footerLink;
};

export default async function decorate(block) {
  block.parentElement.classList.add('footer-links');
  const footerLinkList = document.createElement('ul');
  footerLinkList.classList.add('footer-links__list', 'util-body-xs');

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
  block.replaceWith(footerLinks);
}
