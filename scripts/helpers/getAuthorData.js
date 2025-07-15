import { prepURL } from "./index.js";

/**
 * Fetches data from the author's page, and if not found, will return
 * the Adobe Design author profile data.
 *
 * @return {Object|undefined} an object containing author data,
 * including their name, job title, picture, and bio.
 */

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

const fetchAuthorData = async (url) => {
  const resp = await fetch(url);

  if (!resp.ok) {
    console.warn(`We could not fetch author data for ${authorName} — Status ${resp.status}`);
  };

  const dataHTML = await resp.text();
  const dataContainer = document.createElement('div');
  dataContainer.innerHTML = dataHTML;

  return {
    name: dataContainer.querySelector('h1')?.innerText,
    title: dataContainer.querySelector('h2')?.innerText,
    // the HTML picture element
    image: dataContainer.querySelector('picture') || undefined,
    // support for multiple paragraphs
    // sliced due to the image originally contained within a `p`
    description: [...dataContainer.querySelectorAll('p')]?.slice(1),
  };
}

export const getAuthorData = async () => {
  try {
    const authors = document.head.querySelector("meta[name='author']")?.content.split(",");
    const authorNames = authors.map((author) => prepURL(author));

    const authorData = await Promise.all(
      authorNames.map(async (authorName) => {
        try {
          return await fetchAuthorData(`/authors/${authorName}.plain.html`);
        } catch (err) {
          console.warn(`We couldn't retreieve author data for ${authorName}. Displaying fallback author. - Error ${err}`);
          try {
            return await fetchAuthorData(FALLBACK_AUTHOR_URL);
          } catch (fallbackErr) {
            console.warn(`We couldn't retreieve fallback author data. - Error ${fallbackErr}`);
            return FALLBACK_AUTHOR_DATA;
          };
        };
      })
    );

    // Filter out any undefined author data
    return authorData.filter(Boolean);
  } catch (err) {
    console.warn(`We could not process author data. The author metadata may be missing. - Error ${err}`);
  };
}
