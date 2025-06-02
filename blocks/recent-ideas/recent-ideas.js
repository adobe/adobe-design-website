import { createOptimizedPicture } from "../../scripts/aem.js";
import { createCard } from "../card/card.js";
import { dataStore } from "../../scripts/dataStore.js";

/**
 * The settings object used for fetching and creating the list of ideas.
 * @typedef {object} RecentIdeasSettings
 * @property {string} tagName - Fetch articles with this tag, or "All" to fetch all articles.
 * @property {number} maxArticles - Max articles to fetch or -1 for infinite.
 * @property {string} gridItemClass - Class for each grid item that determines layout; e.g. "grid-item--25" for four-up layout.
 * @property {boolean} hasHorizontalScroll - Has horizontal scroll at mobile.
 */

/**
 * Fetch article data, create card markup, and append it.
 * @param {HTMLElement} cardsParent Parent element to append cards to.
 * @param {RecentIdeasSettings} settings Settings for what is fetched and how many are fetched.
 */
const fetchDataAndCreateCards = async (cardsParent, settings) => {
    // Contains all of the grid items and cards to be appended at the end.
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
            const card = createCard({
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
        // Append everything within our fragment to this parent.
        cardsParent.append(articleHolder);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching and displaying the articles: ${error}`)
        return;
    }
};

/*
 * Recent Ideas Block
 *
 * Fetches and displays recent ideas (articles), with a few options:
 * - Pulls in articles by the tag entered, or all articles.
 * - Limits articles to the max number entered, or can display all.
 * - Can display articles in a two-up or four-up layout.
 */
export default function decorate(block) {
    // Block settings from content.
    const settings = {
        tagName: block.children?.[0]?.children?.[0]?.textContent?.trim() ?? "All",
        maxArticles: parseInt(block.children?.[1]?.children?.[0]?.textContent?.trim(), 10),
        gridItemClass: block.children?.[2]?.children?.[0]?.textContent?.trim().toLowerCase() === "four-up" ? 'grid-item--25' : 'grid-item--50',
        hasHorizontalScroll: block.children?.[2]?.children?.[1]?.textContent?.trim().toLowerCase() === "scrolling",
    };

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.className = !settings.hasHorizontalScroll ? 'recent-ideas grid-container' : 'recent-ideas grid-container grid-container--with-scroll';
    newBlock.dataset.blockName = 'recent-ideas';

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);

    // Fetch and add markup for articles (async).
    fetchDataAndCreateCards(newBlock, settings);
}
