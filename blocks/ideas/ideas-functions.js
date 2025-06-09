/**
 * @file Ideas block specific functions used to assist with block decoration.
 */
import { getCurrentBreakpoint, fetchAndBuildIdeas } from "../../scripts/helpers/index.js";

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
export const buildIdeasFeature = (featureContent) => {
    // Check for required content.
    if (!featureContent.headingText) {
        return null;
    }

    // Create markup.
    // This element is both a grid item for the larger page layout, and a grid container for its children.
    const feature = document.createElement('div');
    feature.classList.add('ideas__feature', 'grid-item', 'grid-item--100');

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

/**
 * Determine total number of ideas to load initially.
 * @param {number} totalFeatures Total number of feature sections.
 * @param {number} groupTotal How many cards before a feature and how many additional to fetch on load more.
 * @returns {number}
 */
export const initialMaxIdeas = (totalFeatures, groupTotal) => {
    // At least the groupTotal, if there are no features.
    if (!totalFeatures) return groupTotal;
    // Include a set of cards above every feature and below the last feature.
    return (totalFeatures * groupTotal) + groupTotal;
};

/**
 * Calculate number of cards per grouping, based on screen size.
 * @returns {number}
 */
export const calculateGroupTotal = () => ({
    sm: 3,
    md: 4,
    lg: 8,
    xl: 8,
}[getCurrentBreakpoint()] || 8);

/**
 * Handle click on the load more button.
 * 
 * @param {PointerEvent} event
 */
export const handleLoadMore = async (event) => {
    const clickedButton = event.target?.closest('.ideas__load-button');
    const gridContainer = event.target?.closest('.ideas')?.querySelector('.ideas__grid');
    const lastCardItem = gridContainer?.querySelector('.grid-item:last-child:has(.card)');

    /**
     * Update state of button depending on whether it's currently loading or not.
     * Or whether we've reached the end of the articles and the button should disappear.
     * @param {boolean} isLoading 
     * @param {boolean} reachedLastArticle 
     */
    const updateButtonState = (isLoading = false, reachedLastArticle = false) => {
        if (reachedLastArticle === true) {
            clickedButton.disabled = true;
            clickedButton.style.display = 'none';
        } else {
            clickedButton.disabled = isLoading;
            clickedButton.dataset.isLoading = isLoading;
            clickedButton.textContent = isLoading ? clickedButton.dataset.loadingText : clickedButton.dataset.defaultText;
        }
    };
    updateButtonState(true);

    // Find last card's href (article path is unique).
    const lastCardPath = lastCardItem?.querySelector('a.card')?.getAttribute('href');
    if (!lastCardPath) {
        // eslint-disable-next-line no-console
        console.error('Could not determine the path of the last ideas article.');
        updateButtonState(false, true);
        return;
    }

    // Fetch ideas older than the last one on the page.
    const fragment = await fetchAndBuildIdeas({
        tagName: 'All',
        maxArticles: 8,
        gridItemClass: 'grid-item--25',
        hasHorizontalScroll: false,
        startAfterPath: lastCardPath,
    });

    // Mark the items loaded via load more with a "was-loaded" data attribute.
    Array.from(fragment?.children || []).forEach(item => item.dataset.wasLoaded = true);

    // Find some info in the fetched articles, then append them.
    const reachedLastArticle = fragment?.lastChild?.dataset?.lastArticle === "true";
    const firstNewCard = fragment?.firstChild?.querySelector('a.card');
    gridContainer.append(fragment);

    // Update button to no longer be in loading state, or remove button if we've reached the end.
    updateButtonState(false, reachedLastArticle);

    // Set focus to the first newly added item.
    // To-do: update live region.
    if (firstNewCard) {
        firstNewCard.focus();
    }
};

/**
 * Rearrange (move) feature elements in between cards in the grid.
 * The position of the features changes at different breakpoints.
 * - Every 4 cards at mobile.
 * - Every 5 cards at medium.
 * - Every 8 cards at extra-large.
 */
export const rearrangeFeatures = (containerElement, groupTotal) => {
    if (!containerElement || !groupTotal) return;

    const features = containerElement?.querySelectorAll('.ideas__feature');
    const cards = containerElement?.querySelectorAll('.grid-item:has(.card)');

    features.forEach((feature, idx) => {
        const cardIndexForInsert = (idx * groupTotal) + groupTotal - 1;
        if (cardIndexForInsert > cards.length - 1) {
            // If more features than cards, stick features at the end.
            containerElement.append(feature);
        } else {
            cards[cardIndexForInsert].after(feature);
        }
    });
};
