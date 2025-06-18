import {
  getAuthorData,
  buildAuthorAside,
  loadArticlePreFooter,
} from "./index.js";

/**
 * Append an author bio and article prefooter with static content to
 * article pages. Also moves main article content to a semantic article
 * element.
 *
 * @return {void}
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

  articleBodyContainer.append(articleElement);

  const articlePreFooter = await loadArticlePreFooter();
  articleElement.after(articlePreFooter);
}
