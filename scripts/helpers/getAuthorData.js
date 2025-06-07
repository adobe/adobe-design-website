import { prepURL } from "./index.js";

/**
 * Fetches data from the author's page,
 *
 * @return {Object|undefined} an object containing author data,
 * including their name, job title, picture, and bio.
 */

export const getAuthorData = async () => {
  try {
    const authors = document.head.querySelector("meta[name='author']")?.content.split(",");
    const authorNames = authors.map((author) => prepURL(author));

    const authorData = await Promise.all(
      authorNames.map(async (authorName) => {
        try {
          const resp = await fetch(`/authors/${authorName}.plain.html`);
      
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
        } catch (err) {
          console.error(`We couldn't retreieve author data for ${authorName} - Error ${err}`);
          return;
        };
      })
    );

    // Filter out any undefined author data
    return authorData.filter(Boolean);
  } catch (err) {
    console.warn(`We could not process author data. The author metadata may be missing. - Error ${err}`);
  };
};
