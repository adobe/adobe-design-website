import { prepURL } from "./index.js";

const FALLBACK_AUTHOR_URL = "/authors/adobe-design.plain.html";
const FALLBACK_AUTHOR_DATA = {
  name: "Adobe Design",
  description: [
    Object.assign(document.createElement("p"), {
      innerText:
        "Adobe Design is the multidisciplinary, global organization behind Adobe experiences. Our full-stack team includes design researchers, design engineers, experience designers, brand designers, content strategists, and program managers dedicated to delivering exceptional experiences for Adobe users.",
    }),
  ],
};

/**
 * Fetches data from the author's page.
 *
 * @param {string} url
 * @return {Object|undefined} an object containing author data,
 * including their name, job title, picture, and bio.
 */
const fetchAuthorData = async (url) => {
  const resp = await fetch(url);

  if (!resp.ok) {
    console.warn(`We could not retrieve author data for ${authorName} — Status ${resp.status}`);
  };

  const dataHTML = await resp.text();
  const dataContainer = document.createElement('div');
  dataContainer.innerHTML = dataHTML;

  return {
    name: dataContainer.querySelector('h1')?.innerText,
    title: dataContainer.querySelector('h2')?.innerText,
    // the HTML picture element
    image: dataContainer.querySelector('picture'),
    // support for multiple paragraphs
    // sliced due to the image originally contained within a `p`
    description: [...dataContainer.querySelectorAll('p')]?.slice(1),
  };
}

/**
 * Fetches data from the Adobe Design author page. If the fetch
 * operation fails, then hardcoded values will be used.
 *
 * @return {Object} an object containing author data,
 * including their name, bio, and an image if successful.
 */
const getFallBackAuthorData = async () => {
  try {
    return await fetchAuthorData(FALLBACK_AUTHOR_URL);
  } catch (err) {
    console.warn(`We couldn't retrieve fallback author data. - Error ${err}`);
    return FALLBACK_AUTHOR_DATA;
  };
}

/**
 * Fetches the data for all authors listed in the metadata, or
 * returns the fallback author data if fetching fails.
 *
 * @return {Array|undefined} an array containing objects containing
 * author info for each author.
 */
export const getAuthorData = async () => {
  try {
    const authors = document.head.querySelector("meta[name='author']")?.content.split(",");
    const authorNames = authors.map((author) => prepURL(author));

    const authorData = await Promise.all(
      authorNames.map(async (authorName) => {
        try {
          return await fetchAuthorData(`/authors/${authorName}.plain.html`);
        } catch (err) {
          console.warn(`We couldn't retrieve author data for ${authorName}. Displaying fallback author. - Error ${err}`);
          return await getFallBackAuthorData();
        };
      })
    );

    // Filter out any undefined author data
    return authorData.filter(Boolean);
  } catch (err) {
    console.warn(`We could not process author data. The author metadata may be missing. - Error ${err}`);
  };
}
