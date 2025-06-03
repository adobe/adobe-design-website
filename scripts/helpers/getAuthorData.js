import { prepURL } from "./index.js";

export const getAuthorData = async () => {
  const authorName = prepURL(document.head.querySelector("meta[name='author']")?.content);
  const resp = await fetch(`/authors/${authorName}.plain.html`);

  if (resp.ok) {
    const dataContainer = document.createElement('div');
    dataContainer.innerHTML = await resp.text();
  
    return {
      name: dataContainer.querySelector('h1')?.innerText,
      title: dataContainer.querySelector('h2')?.innerText,
      image: dataContainer.querySelector('picture') || undefined,
      description: [...dataContainer.querySelectorAll('p')]?.slice(1),
    };
  };

  return null;
};
