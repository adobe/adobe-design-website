import { appendCleanText } from '../../scripts/helpers/index.js';

/**
 * Represents the data used within a card.
 * @typedef {object} CardData
 * @property {HTMLPictureElement} img - Card image(s) within a picture element.
 * @property {HTMLCollection} textContent - Iterable elements containing one paragraph for the title and one for the description.
 * @property {string} url - URL that the card links to.
 */

/**
 * Create markup for a single card from card data, and return it.
 * @param {CardData} cardData
 * @returns {HTMLDivElement}
 */
export function createCard(cardData) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  const card = document.createElement('a');
  card.className = 'card';
  if (cardData?.url) {
    card.setAttribute('href', cardData.url.trim());
  }

  cardData.img.classList.add('card__image');
  cardData.img.setAttribute('alt', '');
  card.append(cardData.img);

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
  const cardContainer = createCard(cardData);

  // Replaces empty wrapper div with new markup.
  block.parentElement.replaceWith(cardContainer);
}
