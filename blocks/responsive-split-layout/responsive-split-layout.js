/**
 * Loads and decorates the responsive split layout block.
 * 
 * @param {Element} block the block element
 * @returns {Element}
 */

export default async function decorate(block) {
  const data = {
    imageContent: block.children[0]?.children[0],
    altText: block.children[0]?.children[1] || "",
    textContent: block.children[1]?.children[0]?.children,
    reverseOrderOnMedium: Boolean(block.children[2]?.innerText?.trim()),
  };

  const wrapper = document.createElement("div");
  wrapper.classList.add("responsive-split-layout");

  data.imageContent.classList.add("responsive-split-layout__image");
  if (data.reverseOrderOnMedium) data.imageContent.classList.add("responsive-split-layout__image--reverse");
  wrapper.append(data.imageContent);
  
  const textContentWrapper = document.createElement("div");
  textContentWrapper.classList.add("responsive-split-layout__content");
  if (data.reverseOrderOnMedium) textContentWrapper.classList.add("responsive-split-layout__content--reverse");
  [...data.textContent].forEach((part) => {
    textContentWrapper.append(part);
  });
  wrapper.append(textContentWrapper);

  block.parentElement.replaceWith(wrapper);
}
