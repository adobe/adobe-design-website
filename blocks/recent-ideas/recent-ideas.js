import { getMetadata } from "../../scripts/aem.js";
import { fetchAndBuildIdeas } from "../../scripts/helpers/index.js";

/*
 * Recent Ideas Block
 *
 * Fetches and displays recent ideas (articles), with a few options:
 * - Pulls in articles by the tag entered, or all articles.
 * - Limits articles to the max number entered, or can display all.
 * - Can display articles in a "two-up" or "four-up" layout.
 * - Has extra options for displaying related articles or specific articles by their slugs.
 */
export default function decorate(block) {
    // Block settings from content.
    const settings = {
        tagName: block.children?.[0]?.children?.[0]?.textContent?.trim().split(",") ?? ["All"],
        maxArticles: parseInt(block.children?.[1]?.children?.[0]?.textContent?.trim(), 10),
        gridItemClass: block.children?.[2]?.children?.[0]?.textContent?.trim().toLowerCase() === "two-up" ? 'grid-item--50' : 'grid-item--25',
        hasHorizontalScroll: block.children?.[2]?.children?.[1]?.textContent?.trim().toLowerCase() === "scrolling",
    };
    
    // Adjustments for optional special case settings.
    if (settings.tagName?.[0]?.trim() === "UseMetadataTags") {
        // Special case tag name; get tags from page metadata or fall back to "All". 
        // Used for finding related stories to an article.
        const metadataTags = getMetadata("tag");
        settings.tagName = metadataTags ? metadataTags.split(",") : ["All"];
    } else if (settings.tagName?.[0]?.trim().startsWith("ArticlesBySlug:")) {
        // Special case tag name; get a specific list of posts by their slug.
        // Allows displaying a curated list of posts that don't have a common tag.
        let articleSlugs = settings.tagName.map(
            // Remove all line breaks, tabs, and prefix text. And get the slug without slashes.
            s => s.replace(/[\n\r\t]/g, "").replace("ArticlesBySlug:", "").replace("/ideas/", "").trim().replace(/^\/|\/$/g, "")
        );
        // Add setting and adjust other settings.
        if (articleSlugs?.[0]) {
            settings.articleSlugs = articleSlugs;
            settings.tagName = ["All"];
            settings.maxArticles = -1;
        }
    }

    // Create a new container to house the block.
    const newBlock = document.createElement('div');
    newBlock.className = !settings.hasHorizontalScroll ? 'recent-ideas grid-container' : 'recent-ideas grid-container grid-container--with-scroll';
    newBlock.dataset.blockName = 'recent-ideas';

    // Replace the empty wrapper div around the block with our new markup.
    block.parentElement.replaceWith(newBlock);

    // Fetch and add markup for articles (async).
    const fetchAndAppend = async () => {
        let fragment = await fetchAndBuildIdeas(settings);

        // If no articles are found, fall back to fetching to "All" instead of a null state.
        if (!fragment.hasChildNodes() && settings.tagName?.[0]?.trim().toLowerCase() !== "all") {
            fragment = await fetchAndBuildIdeas({ ...settings, tagName: ["All"] });
        }

        newBlock.append(fragment);
    };
    fetchAndAppend();
}
