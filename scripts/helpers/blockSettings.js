/**
 * List of blocks that do not have a CSS file.
 * - Some blocks do not need any custom CSS and use utility classes.
 * - Some blocks CSS are part of the global style files e.g. global-blocks.css and styles.css
 * 
 * Block names included here will have the automatic CSS fetching disabled in loadBlock().
 */
export const blocksWithoutCSS = [
    "button-group",
    "card",
    "constrained-text",
    "fragment",
    "image-with-caption",
    "job-listing",
    "lede",
    "plaintext",
    "recent-ideas",
    "search",
];
