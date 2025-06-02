import { createOptimizedPicture } from "../aem.js";
import { getAuthorData } from "./index.js";

export const buildAuthorBio = async () => {
  const authorData = await getAuthorData();
  const author = {
    name: authorData.title,
    title: "Placeholder Title",
    image: createOptimizedPicture(authorData.image),
    description: authorData.description,
  }

  const authorBio = document.createElement("div");
  authorBio.classList.add("author-bio");

  author.image.classList.add("author-meta__image");

  const authorName = document.createElement("span");
  authorName.classList.add("author-meta__name", "util-title-m");
  authorName.innerText = author.name;

  const authorJobTitle = document.createElement("span");
  authorJobTitle.classList.add("author-meta__title", "util-detail-s");
  authorJobTitle.innerText = author.title;

  const authorInfo = document.createElement("div");
  authorInfo.classList.add("author-meta__info");
  authorInfo.append(authorName, authorJobTitle);

  const authorMeta = document.createElement("div");
  authorMeta.classList.add("author-meta");
  authorMeta.append(author.image, authorInfo);

  const authorDescription = document.createElement("p");
  authorDescription.classList.add("author-description")
  authorDescription.innerText = author.description;

  authorBio.append(authorMeta, authorDescription);
  return authorBio;
}
