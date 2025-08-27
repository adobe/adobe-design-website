import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer.
 * @function
 * @param {Element} block The footer block element
 * @returns {Element}
 */

export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/partials/footer';
  const fragment = await loadFragment(footerPath);

  // create the footer from that fragment
  const footer = document.createElement('div');
  footer.classList.add('footer-content');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.replaceWith(footer);
}
