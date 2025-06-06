
import { fetchAndBuildIdeas } from "../../scripts/helpers/fetchAndBuildIdeas.js";

/**
 * Object representing each feature row in the content.
 * @typedef {object} IdeasFeatureContent
 * @property {string} headingText - Main heading text.
 * @property {HTMLCollection} description - Description text appearing under heading. Typically paragraph(s).
 * @property {HTMLPictureElement} image
 * @property {HTMLAnchorElement} buttonLink - Anchor element; linked text that will be turned into the button.
 * @property {string} buttonAriaLabel - Optional aria-label for the button.
 */

/**
 * Create markup for ideas feature section from data/content, and return it.
 * Title text is required.
 * @param {IdeasFeatureContent} featureContent
 * @returns {HTMLDivElement|null} Markup of feature, or null if missing required content.
 */
const buildIdeasFeature = (featureContent) => {
    // Check for required content.
    if (!featureContent.headingText) {
        return null;
    }

    // Create markup.
    // This element is both a grid item for the larger page layout, and a grid container for its children.
    const feature = document.createElement('div');
    feature.classList.add('ideas__feature', 'grid-item--100');

    // Content side which contains text elements and button.
    const mainContent = document.createElement('div');
    mainContent.classList.add('ideas__feature-content');

    const heading = document.createElement('h2');
    heading.classList.add('ideas__feature-heading');
    heading.textContent = featureContent.headingText;
    mainContent.append(heading);

    if (featureContent.description && featureContent.description instanceof HTMLCollection) {
        const description = document.createElement('div');
        description.classList.add('ideas__feature-description');
        description.append(...featureContent.description);
        mainContent.append(description);
    }

    if (featureContent.buttonLink && featureContent.buttonLink instanceof HTMLAnchorElement) {
        const button = featureContent.buttonLink;
        button.classList.add('ideas__feature-button', 'button', 'button--primary-outline');

        if (featureContent.buttonAriaLabel) {
            button.setAttribute("aria-label", featureContent.buttonAriaLabel);
        }
        mainContent.append(button);
    }

    // Image aside.
    let image = null;
    if (featureContent.image && featureContent.image instanceof HTMLPictureElement) {
        image = featureContent.image;
        image.classList.add('ideas__feature-image');
        image.setAttribute('alt', '');
        feature.append(image);
    }

    feature.append(mainContent);
    return feature;
}

const initialMaxIdeas = (totalFeatures, interval) => {
    // At least the interval, if there are no features.
    if (!totalFeatures) return interval;
    // Set of cards above every feature and below the last feature.
    return (totalFeatures * interval) + interval;
};

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
    const interval = 4;

    // Fetch and add markup for articles, and then add in the features.
    const fetchAndAppend = async () => {
        const fragment = await fetchAndBuildIdeas({
            tagName: 'All',
            maxArticles: initialMaxIdeas(features.length, interval),
            gridItemClass: 'grid-item--25',
            hasHorizontalScroll: false,
        });

        // Static node list of cards.
        const cards = Array.from(fragment?.children ?? []);

        // Add features in between cards in the grid:
        // - Every 4th item at mobile.
        // - Every 5th item at medium.
        // - Every 9th item at extra-large.
        features.forEach((feature, idx) => {
            const cardIndexForInsert = (idx * interval) + interval - 1;
            if (cardIndexForInsert > cards.length) {
                // If more features than cards, stick features at the end.
                fragment.append(feature);
            } else {
                cards[cardIndexForInsert].insertAdjacentElement('afterend', feature);
            }
        });

        // Append load more button.
        const loadMoreButton = document.createElement('button');
        loadMoreButton.classList.add('ideas__load-button', 'button', 'button--primary');
        loadMoreButton.textContent = 'Load more ideas';
        newBlock.append(loadMoreButton);

        // Append all cards and features.
        gridContainer.append(fragment);
    };
    fetchAndAppend();

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);
}
