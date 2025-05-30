/**
 * Loads and decorates the constrained text block,
 * a limited-width, left-aligned utility block.
 * @function
 * @param {Element} block The text block element
 * @returns {Element}
 */

export default function decorate(block) {
  // Row of content from the block; typically one or more paragraphs.
  const textContent = block?.children?.[0]?.children?.[0];
  const constrainedText = document.createElement("div");
  constrainedText.classList.add("constrained-text", "util-constrained-text");

  // Move just the content elements we want into our fragment.
  while (textContent.firstChild) {
    constrainedText.appendChild(textContent.firstChild);
  }

  block.parentElement.replaceWith(constrainedText);
}
