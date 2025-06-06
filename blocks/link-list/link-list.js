import { isExternalURL } from '../../scripts/helpers/index.js';

/**
 * Creates a decorated set of link list items.
 * @function
 * @param {string} textContent the desired link text
 * @param {string} url the desired link href
 * @param {string} [altText] the link aria-label
 * @returns {Element}
 */

const buildLinkListItem = ({ textContent, url, altText }) => {
  const item = document.createElement("li");
  const itemAnchor = document.createElement("a");
  itemAnchor.className = "link-list-item";
  itemAnchor.href = url;
  if (altText) itemAnchor.setAttribute("aria-label", altText);

  const itemContent = document.createElement("div");
  itemContent.className = "link-list-item__content";
  itemAnchor.append(itemContent);

  if (isExternalURL(url)) {
    itemAnchor.classList.add("link-list-item--external");
  }

  textContent.forEach((textNode) => {
    const itemContentPart = document.createElement("span");
    itemContentPart.innerText = textNode.innerText;
    itemContent.append(itemContentPart);
  });

  if (url.startsWith("https://adobe.design/careers/")) {
    itemContent.children[0].className = "link-list-item__job-title";
    itemContent.children[1].className =
      "link-list-item__job-department";
    itemContent.children[2].className = "link-list-item__job-location";
  }

  item.append(itemAnchor);
  return item;
};

/**
 * Creates a link to display below the link list block.
 * @function
 * @param {string} textContent the desired link text
 * @param {string} url the desired link href
 * @param {string} [altText] the link aria-label
 * @returns {Element}
 */

const buildLinkListFooterLink = ({ textContent, url, altText }) => {
  const footerLink = document.createElement("a");
  footerLink.classList.add("button", "link-list-footer-link");
  footerLink.textContent = textContent;
  footerLink.href = url;
  if (altText) footerLink.setAttribute("aria-label", altText);

  return footerLink;
}

/**
 * Loads and decorates the link list block.
 * @function
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate(block) {
  const linkList = document.createElement("ul");
  linkList.classList.add("link-list");

  const linksData = [...block.children].slice(1).map((row) => ({
    textContent: [...row.children[0].children],
    url: row.children[1].innerText,
    altText: row.children[2]?.innerText,
  }));

  const footerLinkData = {
    textContent: block.children[0]?.children[0]?.innerText,
    url: block.children[0]?.children[1]?.innerText,
    altText: block.children[0]?.children[2]?.innerText,
  };

  if (linksData.every((link) => link.url.startsWith("https://adobe.design/careers/")))
    linkList.classList.add("link-list--jobs");
  linksData.forEach((row) => {
    const linkListItem = buildLinkListItem(row);
    linkList.append(linkListItem);
  });

  block.parentElement.replaceWith(linkList);

  if (footerLinkData.textContent && footerLinkData.url) {
    const footerLink = buildLinkListFooterLink(footerLinkData);
    linkList.after(footerLink);
  };
}
