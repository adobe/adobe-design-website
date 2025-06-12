/**
 * Loads and decorates the feature-layout block.
 * @function
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate (block) {
  const data = {
    backgroundColor: block.children?.[0]?.innerText?.trim(),
    textContent: block.children?.[1]?.children?.[0],
    imageContent: block.children?.[1]?.children?.[1],
    altText: block.children?.[1]?.children?.[2]?.innerText?.trim(),
    primaryVariant: Boolean(block.children[2]?.innerText?.trim()),
  };

  const featureLayout = document.createElement("div");
  const gridContainer = document.createElement("div");
  featureLayout.classList.add("feature-layout");
  gridContainer.classList.add("grid-container");
  featureLayout.append(gridContainer);

  if (data.primaryVariant) {
    featureLayout.classList.add("feature-layout--primary");
  } else {
    featureLayout.setAttribute(
      "style",
      `background: var(--spectrum-${data.backgroundColor});`
    );
  };

  if (data.imageContent) {
    data.imageContent.classList.add("feature-layout__image");
    if (data.altText) data.imageContent?.setAttribute("alt", data.altText);
    gridContainer.append(data.imageContent);
  };

  data.textContent.classList.add("feature-layout__content");
  gridContainer.append(data.textContent);

  block.parentElement.replaceWith(featureLayout);
}
