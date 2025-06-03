import {
  getAuthorData,
  buildAuthorBio,
  loadArticlePreFooter,
} from "./index.js";

export const buildArticlePage = async () => {
  const articleBodyContainer = document.querySelector(".article-header-container");

  const authorData = await getAuthorData();
  authorData.forEach((author) => {
    const authorBio = buildAuthorBio(author);
    articleBodyContainer.append(authorBio);
  });

  const articlePreFooter = await loadArticlePreFooter();
  articleBodyContainer.append(articlePreFooter);
}
