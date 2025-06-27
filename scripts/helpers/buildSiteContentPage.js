import { dataStore, prepURL } from "../helpers/index.js";

/**
 * Create HTML SECTION element, given list and header data.
 *
 * @param {string} headerText
 * @param {HTMLULElement} list
 * @return {HTMLSECTIONElement}
 */
const createSection = (headerText, list) => {
  const section = document.createElement("section");
  section.classList.add("section");
  const sectionHeader = document.createElement("h2");
  sectionHeader.innerText = headerText;
  section.append(sectionHeader, list);
  return section;
}

/**
 * Create HTML UL element with LI items, given list item data.
 *
 * @param {Array} items
 * @return {HTMLULElement}
 */
const createList = (items) => {
  const list = document.createElement("ul");
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.append(item);
    list.append(listItem);
  });
  return list;
}

/**
 * Create HTML A element, given URL and text content.
 *
 * @param {Array} items
 * @return {HTMLULElement}
 */
const createListItemAnchor = (url = "", textContent) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.innerText = textContent;
  return anchor;
}

/**
 * Append lists detailing article titles and tags, career listings,
 * and authors.
 *
 * @return {void}
 */
export const buildSiteContentPage = async () => {
  const main = document.querySelector("main");

  const articles = await dataStore.getData(dataStore.commonEndpoints.ideas);
  const articleListItems = Array.from(
    articles.data.map((article) =>
      createListItemAnchor(
        article?.path,
        `${article.tag || "Missing article tags"} - ${article.title || "Missing article title"}`
      )
    )
  ).sort((a, b) => a.textContent.localeCompare(b.textContent));

  const allArticleTags = articles.data.map((article) => 
    (article.tag || "Missing article tags")
      .split(",")
      .map((tag) => tag.trim())
  );
  const articleTags = Array.from(new Set(allArticleTags.flat(Infinity)));
  const articleTagsListItems = Array.from(
    articleTags.map((articleTag) =>
      createListItemAnchor(
        `/ideas/${prepURL(articleTag)}`,
        articleTag
      )
    )
  ).sort((a, b) => a.textContent.localeCompare(b.textContent));

  const listings = await dataStore.getData(dataStore.commonEndpoints.careers);
  const listingsListItems = listings.data
    .map((listing) =>
      createListItemAnchor(
        listing?.path,
        `${listing.department || "Missing job department"} - ${listing.title || "Missing job title"}`
      )
    )
    .sort((a, b) => a.textContent.localeCompare(b.textContent));

  const authors = await dataStore.getData(dataStore.commonEndpoints.authors);
  const authorsListItems = authors.data
    .map((author) =>
      createListItemAnchor(
        author?.path,
        author.title || "Missing author name"
      )
    )
    .sort((a, b) => a.textContent.localeCompare(b.textContent));

  // append articles
  const articlesList = createList(articleListItems);
  const articleSection = createSection("Articles", articlesList);
  main.append(articleSection);

  // append article tags
  const articleTagsList = createList(articleTagsListItems);
  const articleTagsSection = createSection("Article Tags", articleTagsList);
  main.append(articleTagsSection);

  // append career listings
  const listingsList = createList(listingsListItems);
  const listingsSection = createSection("Job Listings", listingsList);
  main.append(listingsSection);

  // append authors
  const authorsList = createList(authorsListItems);
  const authorSection = createSection("Authors", authorsList);
  main.append(authorSection);
}
