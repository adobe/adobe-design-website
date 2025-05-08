import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const card = document.createElement('div');
  card.className = 'card';

  const row = block.firstElementChild;
  if (row) {
    const [cardImage, cardBody] = row.children;

    if (cardImage) {
      const img = cardImage.querySelector('img');
      if (img) {
        img.className = 'card__image';
        card.append(img);
      }
    }

    if (cardBody) {
      cardBody.className = 'card__body';
      const [titleElement, descriptionElement] = cardBody.children;
      if (titleElement) titleElement.className = 'card__title util-title-s';
      if (descriptionElement) descriptionElement.className = 'card__description util-body-xs';
      card.append(cardBody);
    }
  }

  card.querySelectorAll('picture > img').forEach((img) => 
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]))
  );

  block.textContent = '';
  block.replaceWith(card);
}
