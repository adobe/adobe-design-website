/*
 * Lede Block
 * The opening paragraph(s) of an article. Its text is larger and stands
 * out from the default paragraph text.
 */
export default function decorate(block) {
    // Row of content from the block; typically one or more paragraphs.
    // Converts HTMLCollection (live collection) to a static array of nodes, so it's usable by replaceChildren.
    const contentArray = Array.from(block?.children?.[0]?.children?.[0]?.children || []);
    contentArray.forEach(el => el.classList.add('util-heading-quote', 'util-bold-font-weight'));

    // Replace starting markup within our parent block div, to remove excess div wrappers.
    block.replaceChildren(...contentArray);
}
