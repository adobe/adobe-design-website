import { fetchAndBuildIdeas } from "../../scripts/helpers/index.js";
import {
  buildIdeasFeature,
  calculateGroupTotal,
  initialMaxIdeas,
  handleLoadMore,
  rearrangeFeatures,
} from "./ideas-functions.js";
/** @typedef {import('./ideas-functions.js').IdeasFeatureContent} IdeasFeatureContent */

/*
 * Ideas Page Block
 *
 * - Lists recent ideas articles, interspersed with featured sections that are entered in the content.
 * - Includes a load more button for loading the next set of articles.
 * - Can pull in a specific tag, for using this block on the story pack (tag) pages.
 */
export default function decorate(block) {
  // Settings from content. Stored in first row with optional second column for the tag.
  const settings = {
    layoutType: block.children?.[0]?.children?.[0]?.textContent?.trim(),
    tag: block.children?.[0]?.children?.[1]?.textContent?.trim() ?? "All",
  };

  // Features content, stored in row(s) after the first row.
  // There could be several features (recommended max of 4), or none.
  const featuresContent = Array.from(block.children ?? []).slice(1);

  // Create a new container to house the block.
  const ideasBlock = document.createElement("div");
  ideasBlock.classList.add("ideas");
  ideasBlock.dataset.blockName = "ideas";

  // Hidden no results found element.
  const noResults = document.createElement("p");
  noResults.style.display = "none";
  noResults.classList.add("util-body-xl", "ideas__no-results");
  noResults.textContent = "No articles found.";
  ideasBlock.append(noResults);

  // Container that houses article and feature grid items.
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container", "ideas__grid");
  gridContainer.id = "ideas-grid";
  gridContainer.dataset.layoutType = settings.layoutType;
  gridContainer.dataset.tag = settings.tag;
  ideasBlock.append(gridContainer);

  // Create new features markup.
  let features = [];
  featuresContent.forEach((feature) => {
    /**
     * @type {IdeasFeatureContent}
     */
    const featureContent = {
      headingText: feature?.children?.[0]?.textContent?.trim(),
      description: feature?.children?.[1]?.children,
      image: feature?.children?.[2]?.firstElementChild,
      buttonLink: feature?.children?.[3]?.firstChild?.firstChild,
      buttonAriaLabel: feature?.children?.[4]?.textContent?.trim(),
    };

    const featureMarkup = buildIdeasFeature(featureContent);
    if (featureMarkup) {
      features.push(featureMarkup);
    }
  });

  // How many cards before a feature.
  const groupTotal = calculateGroupTotal();

  // Fetch and add markup for articles, and then add in the features.
  const fetchAndAppend = async () => {
    const fragment = await fetchAndBuildIdeas({
      tagName: settings.tag,
      maxArticles: initialMaxIdeas(features.length, groupTotal),
      gridItemClass:
        settings.layoutType === "two-up" ? "grid-item--50" : "grid-item--25",
      hasHorizontalScroll: false,
    });
    const isEndOfArticles =
      fragment?.lastChild?.dataset?.lastArticle === "true";

    // Append all cards and features.
    gridContainer.append(fragment, ...features);
    rearrangeFeatures(gridContainer, groupTotal);

    // Append load more button.
    const loadMoreButton = document.createElement("button");
    loadMoreButton.type = "button";
    loadMoreButton.setAttribute("aria-controls", "ideas-grid");
    loadMoreButton.classList.add(
      "button",
      "button--primary",
      "ideas__load-button"
    );
    loadMoreButton.dataset.defaultText = "Load more ideas";
    loadMoreButton.dataset.loadingText = "Loading ideas…";
    loadMoreButton.textContent = loadMoreButton.dataset.defaultText;
    loadMoreButton.addEventListener("click", handleLoadMore);
    if (isEndOfArticles) {
      loadMoreButton.disabled = true;
      loadMoreButton.style.display = "none";
    }
    ideasBlock.append(loadMoreButton);
  };
  fetchAndAppend();

  // Replace the empty wrapper div around the block with our new markup.
  block.parentElement.replaceWith(ideasBlock);
}
