import { isExternalURL } from '../../scripts/helpers/index.js';

/**
 * Creates a decorated set of link list items.
 * @function
 * @param {string} textContent the desired link text
 * @param {string} url the desired link href
 * @returns {Element}
 */

const buildLinkListItem = ({ textContent, url }) => {
  const linkListItem = document.createElement("li");
  const linkListItemAnchor = document.createElement("a");
  linkListItemAnchor.className = "link-list-item";
  linkListItemAnchor.href = url;

  const linkListItemContent = document.createElement("div");
  linkListItemContent.className = "link-list-item__content";
  linkListItemAnchor.append(linkListItemContent);

  if (isExternalURL(url)) {
    linkListItemAnchor.classList.add("link-list-item--external");
  }

  textContent.forEach((textNode) => {
    const linkListItemContentPart = document.createElement("span");
    linkListItemContentPart.innerText = textNode.innerText;
    linkListItemContent.append(linkListItemContentPart);
  });

  if (url.startsWith("https://adobe.design/jobs/job-posts/")) {
    linkListItemContent.children[0].className = "link-list-item__job-title";
    linkListItemContent.children[1].className =
      "link-list-item__job-department";
    linkListItemContent.children[2].className = "link-list-item__job-location";
  }

  linkListItem.append(linkListItemAnchor);
  return linkListItem;
};

/**
 * Loads and decorates the link list block.
 * @function
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate(block) {
  const linkListContainer = document.createElement("div");
  const linkList = document.createElement("ul");
  linkListContainer.classList.add("link-list");
  linkListContainer.append(linkList);

  const linkListLinksData = [...block.children].map((row) => ({
    textContent: [...row.children[0].children],
    url: row.children[1].innerText,
  }));

  linkListLinksData.forEach((row) => {
    const linkListItem = buildLinkListItem(row);
    linkList.append(linkListItem);
  });

  block.replaceWith(linkListContainer);
}
