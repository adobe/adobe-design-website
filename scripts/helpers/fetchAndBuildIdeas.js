import { createOptimizedPicture } from "../aem.js";
import { buildCard } from "../../blocks/card/card.js";
import { dataStore } from "./dataStore.js";

/**
 * The settings object used for fetching and creating the list of ideas.
 * @typedef {object} FetchIdeasSettings
 * @property {string} tagName - Fetch articles with this tag, or "All" to fetch all articles.
 * @property {number} maxArticles - Max articles to fetch or -1 for infinite.
 * @property {string} gridItemClass - Class for each grid item that determines layout; e.g. "grid-item--25" for four-up layout.
 * @property {boolean} hasHorizontalScroll - Has horizontal scroll at mobile.
 */

/**
 * Fetch article data and create all card markup.
 * @param {FetchIdeasSettings} settings Settings for what is fetched and how many are fetched.
 * @return {Promise<DocumentFragment>} Fragment containing all card elements.
 */
export const fetchAndBuildIdeas = async (settings) => {
    // Contains all of the grid items and cards.
    const articleHolder = document.createDocumentFragment();

    try {
        // Fetch articles from JSON.
        // The articles should already be sorted with the latest (published date) first in the returned data.
        const articles = await dataStore.getData(dataStore.commonEndpoints.ideas);
        let filteredArticles = articles.data;

        // Filter by the specific tag.
        const tagToFind = settings.tagName.trim().toLowerCase();
        if (tagToFind !== 'all') {
            filteredArticles = filteredArticles.filter(item => item.tag.trim().toLowerCase() === tagToFind);
        }

        // Sort by published date (serial number or timestamp), with the latest dates first.
        filteredArticles = filteredArticles.sort((a, b) => parseInt(b.publishedDate, 10) - parseInt(a.publishedDate, 10));

        // Limit the number of results displayed.
        if (settings.maxArticles !== -1) {
            filteredArticles = filteredArticles.slice(0, Number.isInteger(settings.maxArticles) ? settings.maxArticles : 4);
        }

        // Build markup.
        filteredArticles.forEach(article => {
            // Create a grid item for a two-up or four-up layout.
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item', settings.gridItemClass);

            // Create card and append.
            const articleImageUrl = article.image.trim();
            const card = buildCard({
                img: articleImageUrl ? createOptimizedPicture(articleImageUrl) : '',
                textContent: [
                    article.title,
                    article.description
                ],
                url: article.path.trim(),
            });
            gridItem.append(card);
            articleHolder.append(gridItem);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching and displaying the articles: ${error}`)
    }
    return articleHolder;
};
