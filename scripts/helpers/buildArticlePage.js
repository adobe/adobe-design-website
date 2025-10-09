import { getMetadata } from '../../scripts/aem.js';
import {
  getAuthorData,
  buildAuthorAside,
  loadArticlePreFooter,
  prepURL,
} from "./index.js";

/**
 * Parent directory for tag pages. Followed by the sluggified name of the tag.
 */
const tagsRootDirectory = "/ideas/";

/**
 * Build list of linked article tags.
 * @returns {HTMLDivElement|null}
 */
const buildArticleTags = () => {
  const tags = getMetadata('tag');
  if (!tags) return null;

  const tagsWrapper = document.createElement("aside");
  tagsWrapper.classList.add("tags-aside");

  const heading = document.createElement("h2");
  heading.classList.add("util-title-s", "tags-aside__heading");
  heading.textContent = "Tags:";
  tagsWrapper.append(heading);

  const tagsList = document.createElement("ul");
  tagsList.classList.add("tags-list");
  tagsWrapper.append(tagsList);

  const tagsArray = tags.split(',').map(item => item.trim());
  tagsArray.forEach(tag => {
    const tagListItem = document.createElement("li");
    const link = document.createElement("a");
    link.classList.add("button", "button--tag");
    const urlSlug = prepURL(tag);
    link.href = `${tagsRootDirectory}${urlSlug}`;
    link.innerText = tag;
    tagListItem.append(link);
    tagsList.append(tagListItem);
  });

  return tagsWrapper;
};

/**
 * Build markup for article date.
 * @returns {HTMLDivElement|null}
 */
const buildArticleDate = () => {
  const pubDate = getMetadata('publication-date');
  if (!pubDate) return null;

  const dateWrapper = document.createElement("div");
  
  // Create a time element.
  const dateElement = document.createElement("time");
  dateElement.classList.add("article-date");
  dateElement.innerText = pubDate;
  
  // Find the UTC string of the date string provided, and add to time element.
  const pubDateRaw = Date.parse(pubDate);
  const preppedDate = new Date(pubDateRaw).toUTCString();
  dateElement.setAttribute('datetime', preppedDate);
  dateWrapper.append(dateElement);
  
  return dateWrapper;
};

/**
 * Append an author bio and article prefooter with static content to
 * article pages. Also moves main article content to a semantic article
 * element.
 */
export const buildArticlePage = async () => {
  if (window.errorCode === "404") return;

  // Moves main article content to a semantic article element.
  const articleBodyContainer = document.querySelector(".article-header-container");
  const articleElement = document.createElement("article");
  
  while (articleBodyContainer.firstChild) {
    articleElement.appendChild(articleBodyContainer.firstChild);
  };

  // Append author bio, date, and tags to the bottom.
  const authorData = await getAuthorData();
  const authorBios = buildAuthorAside(authorData);
  articleElement.append(authorBios);

  const articleDate = buildArticleDate();
  if (articleDate) articleElement.append(articleDate);

  const articleTags = buildArticleTags();
  if (articleTags) articleElement.append(articleTags);

  articleBodyContainer.append(articleElement);

  // Append article prefooter after that.
  const articlePreFooter = await loadArticlePreFooter();
  articleElement.after(articlePreFooter);
}
