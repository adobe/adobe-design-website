/**
 * Loads and decorates the feature-layout block.
 * @function
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate (block) {
  const backgroundColor = block.children[0]?.innerText?.trim();
  const textContent = block.children[1]?.children[0];
  const imageContent = block.children[1]?.children[1];
  const primaryVariant = Boolean(block.children[2]?.innerText?.trim());

  const featureLayout = document.createElement("div");
  const gridContainer = document.createElement("div");
  featureLayout.classList.add("feature-layout");
  gridContainer.classList.add("grid-container");
  featureLayout.append(gridContainer);

  if (primaryVariant) {
    featureLayout.classList.add("feature-layout--primary");
  } else {
    featureLayout.setAttribute(
      "style",
      `background: var(--spectrum-${backgroundColor});`
    );
  };

  if (imageContent.children[0]) {
    imageContent.classList.add("feature-layout__image");
    gridContainer.append(imageContent);
  };

  textContent.classList.add("feature-layout__content");
  gridContainer.append(textContent);

  block.parentElement.replaceWith(featureLayout);
}
