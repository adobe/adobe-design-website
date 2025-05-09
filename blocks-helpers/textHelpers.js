export const cleanText = (data, element) => {
    // remove semantic tags from a block of text
    // and return it as a set of spans
    [data].forEach((textNode) => {
      const part = document.createElement('span');
      part.textContent = textNode.textContent.trim();
      element.append(part);
    });
  return
}
