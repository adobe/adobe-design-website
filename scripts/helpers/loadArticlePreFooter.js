import { loadFragment } from "../../blocks/fragment/fragment.js";

/**
 * Retrieves the repeatable copy for listing prefooter from the partials directory on Sharepoint
 *
 * @return {string} an HTML <section> node
 */

export const loadArticlePreFooter = async () => {
  try {
    const prefooterMainContent = await loadFragment("/partials/article-prefooter"); 
    const prefooterContent = prefooterMainContent?.querySelector("div"); 

    if (prefooterContent) {
      const prefooterContainer = document.createElement("section");
      prefooterContainer.classList.add("article-prefooter");

      while (prefooterContent.firstChild) {
        prefooterContainer.append(prefooterContent.firstChild);
      };

      return prefooterContainer;
    } else {
      console.warn("We could not find prefooter content in the prefooter page.");
      return;
    };
  } catch (err) {
    console.warn("We could not load the prefooter content in the prefooter page.");
  };
}
