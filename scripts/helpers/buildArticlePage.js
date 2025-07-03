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
  heading.classList.add("util-title-s");
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
 * Append an author bio and article prefooter with static content to
 * article pages. Also moves main article content to a semantic article
 * element.
 */
export const buildArticlePage = async () => {
  if (window.errorCode === "404") return;

  const articleBodyContainer = document.querySelector(".article-header-container");
  const articleElement = document.createElement("article");
  
  while (articleBodyContainer.firstChild) {
    articleElement.appendChild(articleBodyContainer.firstChild);
  };

  const authorData = await getAuthorData();
  const authorBios = buildAuthorAside(authorData);
  articleElement.append(authorBios);

  const articleTags = buildArticleTags();
  if (articleTags) articleElement.append(articleTags);

  articleBodyContainer.append(articleElement);

  const articlePreFooter = await loadArticlePreFooter();
  articleElement.after(articlePreFooter);
}
