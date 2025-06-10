
import { fetchAndBuildIdeas } from "../../scripts/helpers/index.js";
import { buildIdeasFeature, calculateGroupTotal, initialMaxIdeas, handleLoadMore, rearrangeFeatures } from "./ideas-functions.js";
/** @typedef {import('./ideas-functions.js').IdeasFeatureContent} IdeasFeatureContent */

/*
 * Ideas Page Block
 *
 * - Lists recent ideas articles, interspersed with featured sections that are entered in the content.
 * - Includes a load more button for loading the next set of articles.
 */
export default function decorate(block) {
    // Layout type setting.
    const layoutType = block.children?.[0]?.children?.[0]?.textContent?.trim();

    // Features content, stored in row(s) after the first row.
    // There could be several features (recommended max of 4), or none.
    const featuresContent = Array.from(block.children ?? []).slice(1);

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.classList.add('ideas');
    newBlock.dataset.blockName = 'ideas';

    // Hidden no results found element.
    const noResults = document.createElement('p');
    noResults.style.display = 'none';
    noResults.classList.add('ideas__no-results', 'util-body-xl');
    noResults.textContent = 'No articles found.';
    newBlock.append(noResults);

    // Container that houses article and feature grid items.
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('ideas__grid', 'grid-container');
    gridContainer.id = "ideas-grid";
    gridContainer.dataset.layoutType = layoutType;
    newBlock.append(gridContainer);

    // Append aria-live region to help announce when new posts are loaded.
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('util-visually-hidden');
    liveRegion.id = "ideas-live-region";
    newBlock.append(liveRegion);

    // Create new features markup.
    let features = [];
    featuresContent.forEach(feature => {
        /**
         * @type {IdeasFeatureContent}
         */
        const featureContent = {
            headingText: feature?.children?.[0]?.textContent?.trim(),
            description: feature?.children?.[1]?.children,
            image: feature?.children?.[2]?.firstElementChild,
            buttonLink: feature?.children?.[3]?.firstChild?.firstChild,
            buttonAriaLabel: feature?.children?.[4]?.textContent?.trim(),
        };

        const featureMarkup = buildIdeasFeature(featureContent);
        if (featureMarkup) {
            features.push(featureMarkup);
        }
    });

    // How many cards before a feature.
    const groupTotal = calculateGroupTotal();

    // Fetch and add markup for articles, and then add in the features.
    const fetchAndAppend = async () => {
        const fragment = await fetchAndBuildIdeas({
            tagName: 'All',
            maxArticles: initialMaxIdeas(features.length, groupTotal),
            gridItemClass: layoutType === 'two-up' ? 'grid-item--50' : 'grid-item--25',
            hasHorizontalScroll: false,
        });
        const isEndOfArticles = fragment?.lastChild?.dataset?.lastArticle === "true";

        // Append all cards and features.
        gridContainer.append(fragment, ...features);
        rearrangeFeatures(gridContainer, groupTotal);

        // Append load more button.
        const loadMoreButton = document.createElement('button');
        loadMoreButton.type = "button";
        loadMoreButton.setAttribute('aria-controls', 'ideas-grid');
        loadMoreButton.classList.add('ideas__load-button', 'button', 'button--primary');
        loadMoreButton.dataset.defaultText = "Load more ideas";
        loadMoreButton.dataset.loadingText = "Loading ideas…";
        loadMoreButton.textContent = loadMoreButton.dataset.defaultText;
        loadMoreButton.addEventListener('click', handleLoadMore);
        if (isEndOfArticles) {
            loadMoreButton.disabled = true;
            loadMoreButton.style.display = 'none';
        }
        newBlock.append(loadMoreButton);
    };
    fetchAndAppend();

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);
}
