import { createOptimizedPicture } from "../../scripts/aem.js";
import { createCard } from "../card/card.js";
import { dataStore } from "../../scripts/dataStore.js";

const articleDirectory = '/ideas/';

/**
 * Create card markup with simple content/data.
 * @returns {HTMLDivElement}
 */
const createCardFromData = (titleText, descriptionText, linkURL, imageURL) => {
    // Create elements as the card block builder would expect from the content.
    const titleAndDescription = document.createDocumentFragment();

    const title = document.createElement('p');
    title.textContent = titleText.trim();

    const description = document.createElement('p');
    description.textContent = descriptionText.trim();

    titleAndDescription.append(title);
    titleAndDescription.append(description);

    // Image is a picture element with a generated srcset.
    // const imageURL = '/ideas/media_1e99407a5ddc7da61c03a44192ec6d6bdb8a5f9a3.jpg?width=1200&format=pjpg&optimize=medium';
    const cardPicture = createOptimizedPicture(imageURL);

    // Create the card.
    const card = createCard({
        img: cardPicture, 
        textContent: titleAndDescription.children, 
        url: linkURL.trim(), 
    });
    return card;
}

/*
 * Recent Stories Block
 *
 * Fetches and displays recent stories (articles), with a few options:
 * - Pulls in stories by the tag entered, or all stories.
 * - Limits stories to the max number entered, or can display all.
 */
export default function decorate(block) {
    // TODO: Block settings from content.
    let isFourUp = false;
    let maxStories = -1;

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.className = 'recent-stories grid-container';
    newBlock.dataset.blockName = 'recent-stories';

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);

    /**
     * Fetch article data, create card markup, and append it.
     * @param {HTMLElement} cardsParent Parent element to append cards to.
     */
    const fetchDataAndCreateCards = async (cardsParent) => {
        // Contains all of the grid items and cards to be appended at the end.
        const articleHolder = document.createDocumentFragment();

        try {
            const articles = await dataStore.getData(dataStore.commonEndpoints.queryIndex);
            articles.data.forEach(article => {
                // Skip any unrelated data.
                if (!article.path.trim().startsWith(articleDirectory) ){
                    return;
                }

                // Create a grid item for a two-up or four-up layout.
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item',  isFourUp ? 'grid-item--25' : 'grid-item--50');
                articleHolder.append(gridItem);

                // Create card and append.
                const card = createCardFromData(
                    article.title.trim(),
                    article.description.trim(),
                    article.path.trim(),
                    article.image.trim()
                );
                gridItem.append(card);
            });
            // Append everything within our fragment to this parent.
            cardsParent.append(articleHolder);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error fetching the stories (articles): ${error}`)
            return;
        }
    };
    fetchDataAndCreateCards(newBlock);
}
