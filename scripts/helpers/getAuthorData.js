import { prepURL } from "./index.js";

export const getAuthorData = async () => {
  const authors = document.head.querySelector("meta[name='author']")?.content.split(",");
  const authorNames = authors.map((author) => prepURL(author));

  const authorData = await Promise.all(
    authorNames.map(async (authorName) => {
      const resp = await fetch(`/authors/${authorName}.plain.html`);
    
      if (resp.ok) {
        const dataHTML = await resp.text();
        const dataContainer = document.createElement('div');
        dataContainer.innerHTML = dataHTML;
      
        return {
          name: dataContainer.querySelector('h1')?.innerText,
          title: dataContainer.querySelector('h2')?.innerText,
          image: dataContainer.querySelector('picture') || undefined,
          description: [...dataContainer.querySelectorAll('p')]?.slice(1),
        };
      };

      return null;
    })
  );

  return authorData;
};
