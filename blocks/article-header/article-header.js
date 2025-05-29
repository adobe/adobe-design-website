import { getMetadata } from '../../scripts/aem.js';
import { prepURL } from '../../scripts/helpers/index.js';

export default async function decorate(block) {
  // parse data into an object
  const articleHeaderData = {
    title: block.children?.[0]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    subtitle:
      block.children?.[1]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    author: getMetadata('author'),
    pubDate: getMetadata('publication-date'),
    tag: getMetadata('tag'),
    image: block.children?.[2]?.children?.[0]?.firstElementChild,
    caption: block.children?.[2]?.children?.[1]?.textContent?.trim(),
    altText: block.children?.[2]?.children?.[2]?.textContent?.trim(),
  };

  // create the container element
  const articleHeader = document.createElement("div");
  articleHeader.classList.add("article-header");

  // if there is a tag, add it as an eyebrow
  // that links to the story packs page
  if (articleHeaderData.tag) {
    const eyebrow = document.createElement("a");
    eyebrow.classList.add("article-header__eyebrow", "util-detail-m");
    const urlSlug = prepURL(articleHeaderData.tag);
    eyebrow.href = `/ideas/${urlSlug}`;
    eyebrow.innerText = articleHeaderData.tag;
    articleHeader.append(eyebrow);
  }

  // there should always be a title, so create it as an h1
  const pageTitle = document.createElement("h1");
  pageTitle.classList.add("article-header__title", "util-heading-xl");
  pageTitle.innerText = articleHeaderData.title;
  articleHeader.append(pageTitle);

  // if there is a subtitle, add it as an h2
  if (articleHeaderData.subtitle) {
    const pageSubtitle = document.createElement("h2");
    pageSubtitle.classList.add("article-header__subtitle", "util-title-m");
    pageSubtitle.innerText = articleHeaderData.subtitle;
    articleHeader.append(pageSubtitle);
  }

  // if there is a publication date,
  if (articleHeaderData.pubDate) {
    // create a time element
    const pubDate = document.createElement("time");
    pubDate.classList.add("article-header__date", "util-body-xs");
    pubDate.innerText = articleHeaderData.pubDate;

    // find the UTC string of the date string provided
    const pubDateRaw = Date.parse(articleHeaderData.pubDate);
    const preppedDate = new Date(pubDateRaw).toUTCString();

    // add that to our time element
    pubDate.setAttribute('datetime', preppedDate);

    articleHeader.append(pubDate);
  }

  // if there is an author, build a byline
  if (articleHeaderData.author) {
    const byLine = document.createElement("div");
    byLine.innerHTML = `
      <div class="article-header__byline util-body-xs">Words by</div>
      <div class="article-header__author util-title-m">${articleHeaderData.author}</div>
    `;
    articleHeader.append(byLine);
  }

  // if there is an image, let's add an image
  if (articleHeaderData.image) {
    const imageContainer = document.createElement('figure');
    imageContainer.classList.add('image-with-caption', 'image-with-caption--full-bleed');

    articleHeaderData.image.classList.add('image-with-caption__image');
    if (articleHeaderData.altText) articleHeaderData.image.setAttribute('alt', articleHeaderData.altText);
    imageContainer.append(articleHeaderData.image);

    if (articleHeaderData.caption) {
      const imageCaption = document.createElement('figcaption');
      imageCaption.classList.add('util-detail-s', 'image-with-caption__caption');
      imageCaption.innerText = articleHeaderData.caption;
      imageContainer.append(imageCaption);
    }

    // replace the parent with our new block and then append the image
    block.parentElement.replaceWith(articleHeader, imageContainer);
  } else {
    // replace the parent with our new block
    block.parentElement.replaceWith(articleHeader);
  }
}
