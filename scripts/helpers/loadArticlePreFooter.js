import { loadFragment } from "../../blocks/fragment/fragment.js";

/**
 * Retrieves the repeatable copy for listing prefooter from the partials directory on Sharepoint
 *
 * @function
 * @return {string} an HTML <section> node
 */

export const loadArticlePreFooter = async () => {
  const prefooterMainContent = await loadFragment("/partials/article-prefooter"); 
  const prefooterContent = prefooterMainContent.querySelector("div"); 

  if (prefooterContent) {
    const prefooterContainer = document.createElement("section");
    prefooterContainer.classList.add("article-prefooter");
    prefooterContainer.append(prefooterContent);

    return prefooterContainer;
  };

  return null;
}
