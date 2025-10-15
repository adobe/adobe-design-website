/**
 * Builds a block of information about an article's author(s) on its page.
 *
 * @param {Object} authors
 * @return {string} an HTML <aside> node
 */

export const buildAuthorAside = (authors) => {
  const authorAside = document.createElement("aside");
  authorAside.classList.add("author-aside");
  const authorAsideHeader = document.createElement("h2");
  authorAsideHeader.textContent = "About the authors";
  authorAsideHeader.classList.add("author-aside__header", "util-visually-hidden");
  authorAside.append(authorAsideHeader);

  authors.forEach(({
    name,
    title,
    image,
    description
  }) => {
    const authorBio = document.createElement("section");
    authorBio.classList.add("author-bio");

    const authorMeta = document.createElement("div");
    authorMeta.classList.add("author-meta");
    const authorInfo = document.createElement("div");
    authorInfo.classList.add("author-meta__info");
  
    if (image) {
      image.classList.add("author-meta__image");
      authorMeta.append(image);
    };
  
    const authorName = document.createElement("h3");
    authorName.classList.add("author-meta__name");
    authorName.innerText = name;
    authorInfo.append(authorName);
  
    if (title) {
      const authorJobTitle = document.createElement("span");
      authorJobTitle.classList.add("author-meta__title");
      authorJobTitle.innerText = title;
      authorInfo.append(authorJobTitle);
    };
  
    authorMeta.append(authorInfo);
  
    const authorDescription = document.createElement("div");
    authorDescription.classList.add("author-description");
    description.forEach((part) => authorDescription.append(part));
  
    authorBio.append(authorMeta, authorDescription);
    authorAside.append(authorBio);
  });

  return authorAside;
}
