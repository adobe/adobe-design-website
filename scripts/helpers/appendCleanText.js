/**
 * Takes the text content from iterable elements and places it into span tags within a parent element.
 * Useful for removing the semantic element tags (e.g. <h1>, <p>) from a block of text.
 * 
 * Alternatively, the text content can also be passed in as an array of plain strings to be placed into the spans.
 *
 * @param {HTMLCollection|string[]} data - A set of HTML nodes from which to parse and replace tags. Or, an array of text strings.
 * @param {object} parentElement - The parent element to append the new span elements to.
 */
export const appendCleanText = (data, parentElement) => {
  [...data].forEach((textItem) => {
    const part = document.createElement('span');
    part.textContent = typeof textItem === 'string' ? textItem.trim() : textItem.textContent.trim();
    parentElement.append(part);
  });
  return;
}
