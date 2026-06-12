import { appendCleanText } from '../../scripts/helpers/index.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Represents the data used within a card.
 * @typedef {object} CardData
 * @property {HTMLPictureElement|string} img - Card image(s) within a picture element, or URL of image that will be converted into one.
 * @property {HTMLCollection} textContent - Iterable elements containing one paragraph for the title and one for the description.
 * @property {string} url - URL that the card links to.
 */

/**
 * Create markup for a single card from card data, and return it.
 * @param {CardData} cardData
 * @param {string} cardContainerElement Type of element to use to wrapping container (e.g. 'div' or 'li').
 * @returns {HTMLDivElement} The markup for the card.
 */
export function buildCard(cardData, cardContainerElement = 'div') {
  const cardContainer = document.createElement(cardContainerElement);
  cardContainer.className = 'card-container';

  const card = cardData?.url ? document.createElement('a') : document.createElement('div');
  card.className = 'card';
  if (cardData?.url) {
    card.setAttribute('href', cardData.url);
  }

  // Append image.
  if (cardData?.img) {
    let picture = cardData.img;

    // Create picture element, if arg is the image URL.
    if (typeof cardData.img === 'string') {
      picture = createOptimizedPicture(cardData.img);
    }

    // Modify picture element and append it.
    if (picture instanceof HTMLPictureElement) {
      picture.classList.add('card__image');
      // Set empty alt, to treat images within the card as decorative.
      picture.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));
      card.append(picture);
    }
  }

  // Append title and description.
  const cardContent = document.createElement('div');
  cardContent.classList.add('card__content');
  appendCleanText(cardData.textContent, cardContent);
  cardContent.children?.[0]?.classList.add('card__title', 'util-title-s');
  cardContent.children?.[1]?.classList.add('card__description','util-body-s');
  card.append(cardContent);

  cardContainer.append(card);
  return cardContainer;
}

/*
 * Card Block
 * Creates card using the block content.
 */
export default function decorate(block) {
  const cardData = {
    img: block.children[0].firstElementChild.firstElementChild,
    textContent: block.children[1].children[0].children,
    url: block.children[2].textContent.trim()
  };
  const cardContainer = buildCard(cardData, 'div');

  // Replaces empty wrapper div with new markup.
  block.parentElement.replaceWith(cardContainer);
}
