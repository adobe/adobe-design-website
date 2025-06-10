import { createOptimizedPicture } from "../aem.js";
import { buildCard } from "../../blocks/card/card.js";
import { dataStore } from "./dataStore.js";

/**
 * The settings object used for fetching and creating the list of ideas.
 * @typedef {object} FetchIdeasSettings
 * @property {string|string[]} tagName - Fetch articles with this tag or tags (array), or "All" to fetch all articles.
 * @property {number} maxArticles - Max articles to fetch or -1 for infinite.
 * @property {string} gridItemClass - Class for each grid item that determines layout; e.g. "grid-item--25" for four-up layout.
 * @property {boolean} hasHorizontalScroll - Has horizontal scroll at mobile.
 * @property {string|null} startAfterPath - Optional; return results older than ideas article matching this path.
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

        // Make sure tag(s) is always an array.
        if (!Array.isArray(settings.tagName)) {
            settings.tagName = [settings.tagName];
        }

        // Filter by the specific tag(s).
        const tagsToFind = settings.tagName.map(str => str.trim().toLowerCase());
        if (tagsToFind.length > 0 && tagsToFind[0] != 'all') {
            filteredArticles = filteredArticles.filter(
                ({ tag }) => tagsToFind.includes(tag.trim().toLowerCase())
            );
        }

        // Sort by published date (serial number or timestamp), with the latest dates first.
        filteredArticles = filteredArticles.sort((a, b) => parseInt(b.publishedDate, 10) - parseInt(a.publishedDate, 10));

        // Need to return next set of results starting from article with this path?
        let startFromIndex = 0;
        if (settings?.startAfterPath) {
            const foundIndex = filteredArticles.findIndex(article => article?.path.trim() === settings.startAfterPath);
            if (foundIndex !== -1) {
                startFromIndex = foundIndex + 1;
            }
        }

        // Limit the number of results displayed.
        const lastArticlePath = filteredArticles[filteredArticles.length - 1]?.path?.trim();
        if (settings.maxArticles !== -1) {
            filteredArticles = filteredArticles.slice(startFromIndex, startFromIndex + (Number.isInteger(settings.maxArticles) ? settings.maxArticles : 4));
        }

        // Build markup.
        filteredArticles.forEach((article, idx) => {
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

            // If article is last available, mark it with a data attribute.
            if (idx === filteredArticles.length - 1 && lastArticlePath && article.path.trim() === lastArticlePath) {
                gridItem.dataset.lastArticle = "true";
            }

            // Append card.
            gridItem.append(card);
            articleHolder.append(gridItem);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching and displaying the articles: ${error}`)
    }
    return articleHolder;
};
