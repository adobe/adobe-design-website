import { cleanText } from '../../scripts/helpers/index.js';

export default function decorate(block) {
  const cardData = {
    img: block.children[0].firstElementChild.firstElementChild,
    textContent: block.children[1].children[0].children,
    url: block.children[2].textContent.trim()
  };

  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  const card = document.createElement('a');
  card.className = 'card';

  cardData.img.classList.add('card__image');
  cardData.img.setAttribute('alt', '');
  card.append(cardData.img);

  const cardContent = document.createElement('div');
  cardContent.classList.add('card__content');
  cleanText(cardData.textContent, cardContent);
  cardContent.children[0].classList.add('card__title', 'util-title-s');
  cardContent.children[1].classList.add('card__description','util-body-s');

  card.append(cardContent);
  cardContainer.append(card);
  block.parentElement.replaceWith(cardContainer);
}
