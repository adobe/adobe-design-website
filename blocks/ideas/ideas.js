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
    console.warn(featureContent);
    
    // Check for required content.
    if (!featureContent.headingText) {
        return null;
    }

    // Create markup.
    // This element is both a grid item for the larger page layout, and a grid container for its children.
    const feature = document.createElement('div');
    feature.classList.add('ideas-feature', 'grid-item--100');

    // Content side which contains text elements and button.
    const mainContent = document.createElement('div');
    mainContent.classList.add('ideas-feature__content');

    const heading = document.createElement('h2');
    heading.classList.add('ideas-feature__heading');
    heading.textContent = featureContent.headingText;
    mainContent.append(heading);

    if (featureContent.description && featureContent.description instanceof HTMLCollection) {
        const description = document.createElement('div');
        description.classList.add('ideas-feature__description');
        description.append(...featureContent.description);
        mainContent.append(description);
    }

    if (featureContent.buttonLink && featureContent.buttonLink instanceof HTMLAnchorElement) {
        const button = featureContent.buttonLink;
        button.classList.add('ideas-feature__button', 'button', 'button--primary-outline');

        if (featureContent.buttonAriaLabel) {
            button.setAttribute("aria-label", featureContent.buttonAriaLabel);
        }
        mainContent.append(button);
    }

    // Image aside.
    let image = null;
    if (featureContent.image && featureContent.image instanceof HTMLPictureElement) {
        image = featureContent.image;
        image.classList.add('ideas-feature__image');
        image.setAttribute('alt', '');
        feature.append(image);
    }

    feature.append(mainContent);
    return feature;
}

/*
 * Ideas Page Block
 *
 * - Lists recent ideas articles, interspersed with featured sections that are entered in the content.
 * - Includes a load more button for loading the next set of articles.
 */
export default function decorate(block) {
    // Layout type setting.
    //const layout = block.children?.[1]?.children?.[0]?.textContent?.trim();

    console.warn(block);

    // Features content, stored in row(s) after the first row.
    // There could be several features (recommended max of 4), or none.
    const featuresContent = Array.from(block.children ?? []).slice(1);

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.classList.add('ideas', 'grid-container');
    newBlock.dataset.blockName = 'ideas';

    // Add features to the block.
    // Every 4th item at mobile. Every 5th item at medium. Every 9th item at extra-large.
    featuresContent.forEach(feature => {
        /**
         * @type {IdeasFeatureContent}
         */
        const featureContent = {
            headingText: feature?.children?.[0]?.textContent?.trim(),
            description: feature?.children?.[1]?.children,
            image: feature?.children?.[2]?.firstElementChild,
            buttonLink: feature?.children?.[3]?.firstChild,
            buttonAriaLabel: feature?.children?.[4]?.textContent?.trim(),
        };

        const featureMarkup = buildIdeasFeature(featureContent);
        if (featureMarkup) {
            newBlock.append(featureMarkup);
        }
    });

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);

    // Fetch and add markup for articles (async).
    //fetchDataAndBuildCards(newBlock, settings);
}
