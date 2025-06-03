import {
  getAuthorData,
  buildAuthorBio,
  loadArticlePreFooter,
} from "./index.js";

export const buildArticlePage = async () => {
  const articleBodyContainer = document.querySelector(".article-header-container");
  const authorData = await getAuthorData();
  const authorBio = buildAuthorBio(authorData);
  const articlePreFooter = await loadArticlePreFooter();

  articleBodyContainer.append(authorBio, articlePreFooter);
}
