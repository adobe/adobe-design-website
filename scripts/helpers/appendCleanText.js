/**
 * Takes the text from iterable elements and places it into span tags within an element.
 * Useful for removing the semantic element tags from a block of text.
 * @function
 * @param {object} data - a set of HTML nodes from which to parse and replace tags.
 * @param {object} element - the name of the parent element we are appending to.
 */

export const appendCleanText = (data, element) => {
  [...data].forEach((textNode) => {
    const part = document.createElement('span');
    part.textContent = textNode.textContent.trim();
    element.append(part);
  });
  return;
}
