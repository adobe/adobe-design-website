/**
 * Loads and decorates the responsive split layout block.
 * 
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate(block) {
  const data = {
    imageContent: block.children?.[0]?.children?.[0],
    altText: block.children?.[0]?.children?.[1] || "",
    textContent: block.children?.[1]?.children?.[0]?.children,
    reverseOrderOnMedium: Boolean(block.children?.[2]?.innerText?.trim().toLowerCase() == "reverse"),
    gradientColorLight: block.children?.[3]?.children?.[0]?.innerText?.trim() ?? '',
    gradientColorDark: block.children?.[3]?.children?.[1]?.innerText?.trim() ?? '',
  };

  const wrapper = document.createElement("div");
  wrapper.classList.add("responsive-split-layout");

  if (data.reverseOrderOnMedium) {
    wrapper.classList.add("responsive-split-layout--reverse");
  }

  if (data.gradientColorLight && data.gradientColorDark) {
    wrapper.classList.add("responsive-split-layout--gradient");
    wrapper.style.setProperty('--split-layout-gradient-color-light', data.gradientColorLight);
    wrapper.style.setProperty('--split-layout-gradient-color-dark', data.gradientColorDark);
  }

  const inner = document.createElement("div");
  inner.classList.add("responsive-split-layout__inner");

  if (data.imageContent) {
    data.imageContent.classList.add("responsive-split-layout__image");
    if (data.reverseOrderOnMedium) data.imageContent.classList.add("responsive-split-layout__image--reverse");
    inner.append(data.imageContent);
  };

  if (data.textContent) {
    const textContentWrapper = document.createElement("div");
    textContentWrapper.classList.add("responsive-split-layout__content");
    if (data.reverseOrderOnMedium) textContentWrapper.classList.add("responsive-split-layout__content--reverse");
    [...data.textContent].forEach((part) => {
      textContentWrapper.append(part);
    });
    inner.append(textContentWrapper);
  };

  wrapper.append(inner);
  block.parentElement.replaceWith(wrapper);
}
