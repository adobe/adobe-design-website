/**
 * Loads and decorates the plaintext text block, which allows
 * the nesting of plaintext within layouts.
 *
 * @param {Element} block
 * @returns {void}
 */

export default function decorate(block) {
  const textContent = block?.children?.[0]?.children?.[0];
  const plaintext = document.createElement("div");
  plaintext.classList.add("plaintext");

  while (textContent.firstChild) {
    plaintext.appendChild(textContent.firstChild);
  }

  block.parentElement.replaceWith(plaintext);
}
