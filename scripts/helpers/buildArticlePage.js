import {
  buildAuthorBio,
  loadArticlePreFooter,
} from "./index.js";

export const buildArticlePage = async () => {
  const articleBodyContainer = document.querySelector(".article-header-container");
  const authorBio = await buildAuthorBio();
  const articlePreFooter = await loadArticlePreFooter();

  articleBodyContainer.append(authorBio, articlePreFooter);
}
