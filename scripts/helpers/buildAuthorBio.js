export const buildAuthorBio = ({ name, title, image, description }) => {
  const authorBio = document.createElement("div");
  authorBio.classList.add("author-bio");
  const authorInfo = document.createElement("div");
  authorInfo.classList.add("author-meta__info");

  const authorName = document.createElement("span");
  authorName.classList.add("author-meta__name", "util-title-m");
  authorName.innerText = name;
  authorInfo.append(authorName);

  if (title) {
    const authorJobTitle = document.createElement("span");
    authorJobTitle.classList.add("author-meta__title", "util-detail-s");
    authorJobTitle.innerText = title;
    authorInfo.append(authorJobTitle);
  };

  const authorMeta = document.createElement("div");
  authorMeta.classList.add("author-meta");

  if (image) {
    image.classList.add("author-meta__image");
    authorMeta.append(image);
  };

  authorMeta.append(authorInfo);

  const authorDescription = document.createElement("div");
  authorDescription.classList.add("author-description")
  description.forEach((part) => authorDescription.append(part));

  authorBio.append(authorMeta, authorDescription);
  return authorBio;
}
