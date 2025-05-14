/**
 * Loads and decorates the footer copyright.
 * @function
 * @param {Element} block The block element
 * @returns {Element}
 */

export default function decorate(block) {
  block.parentElement.classList.add('footer-copyright');
  const copyright = document.createElement('div');

  while (block.children[0].children[0].children[0]) {
    copyright.append(block.children[0].children[0].children[0]);
  }

  copyright.classList.add('footer-copyright__content', 'util-detail-s');

  block.replaceWith(copyright);
}
