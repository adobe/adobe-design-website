/*
 * Lede Block
 * The opening paragraph(s) of an article. Its text is larger and stands
 * out from the default paragraph text.
 */
export default function decorate(block) {
    // Row of content from the block; typically one or more paragraphs.
    const ledeContent = block?.children?.[0]?.children?.[0];
    const fragment = document.createDocumentFragment();

    // Move just the content elements we want into our fragment and add some classes.
    while (ledeContent.firstChild) {
        const element = fragment.appendChild(ledeContent.firstChild);
        element.className = 'util-heading-quote';
    }

    // Replace all children of the block element with the contents of the fragment.
    // - Preserves the block element's existing classes and data attributes
    // - Removes excess div wrappers that were originally around the content
    block.replaceChildren(fragment);

    // Remove the empty wrapper div around the block, by moving our block element up
    // and then removing the wrapper.
    const blockWrapper = block.parentElement;
    const grandparent = blockWrapper?.parentElement;
    if (grandparent) {
        grandparent.insertBefore(block, blockWrapper);
        grandparent.removeChild(blockWrapper);
    }
}
