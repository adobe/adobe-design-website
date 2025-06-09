
import { fetchAndBuildIdeas } from "../../scripts/helpers/index.js";
import { buildIdeasFeature, calculateGroupTotal, initialMaxIdeas, handleLoadMore, rearrangeFeatures } from "./ideas-functions.js";

/*
 * Ideas Page Block
 *
 * - Lists recent ideas articles, interspersed with featured sections that are entered in the content.
 * - Includes a load more button for loading the next set of articles.
 */
export default function decorate(block) {
    // Layout type setting.
    //const layout = block.children?.[1]?.children?.[0]?.textContent?.trim();

    // Features content, stored in row(s) after the first row.
    // There could be several features (recommended max of 4), or none.
    const featuresContent = Array.from(block.children ?? []).slice(1);

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.classList.add('ideas');
    newBlock.dataset.blockName = 'ideas';

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('ideas__grid', 'grid-container');
    newBlock.append(gridContainer);

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

    // How many cards before a feature, and how many additional to fetch on load more.
    const groupTotal = calculateGroupTotal();

    // Fetch and add markup for articles, and then add in the features.
    const fetchAndAppend = async () => {
        const fragment = await fetchAndBuildIdeas({
            tagName: 'All',
            maxArticles: initialMaxIdeas(features.length, groupTotal),
            gridItemClass: 'grid-item--25',
            hasHorizontalScroll: false,
        });
        const isEndOfArticles = fragment?.lastChild?.dataset?.lastArticle === "true";

        // Append all cards and features.
        gridContainer.append(fragment, ...features);
        rearrangeFeatures(gridContainer, groupTotal);

        // Append aria-live region to help announce when new posts are loaded.
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('util-visually-hidden');
        newBlock.append(liveRegion);

        // Append load more button if there are more articles.
        if (!isEndOfArticles) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.type = "button";
            loadMoreButton.classList.add('ideas__load-button', 'button', 'button--primary');
            loadMoreButton.dataset.defaultText = "Load more ideas";
            loadMoreButton.dataset.loadingText = "Loading ideas…";
            loadMoreButton.textContent = loadMoreButton.dataset.defaultText;
            loadMoreButton.addEventListener('click', handleLoadMore);
            newBlock.append(loadMoreButton);
        }
    };
    fetchAndAppend();

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);
}
