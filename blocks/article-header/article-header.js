import { getMetadata } from '../../scripts/aem.js';

/**
 * Loads and decorates the article header.
 * @function
 * @param {Element} block The header block element
 * @returns {Element}
 */

export default async function decorate(block) {
  // parse data into an object
  const articleHeaderData = {
    title: block.children?.[0]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    subtitle:
      block.children?.[1]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    author: getMetadata('author'),
    pubDate: getMetadata('publication-date'),
    image: block.children?.[2]?.children?.[0]?.firstElementChild,
    caption: block.children?.[2]?.children?.[1]?.innerHTML,
    altText: block.children?.[2]?.children?.[2]?.textContent?.trim(),
  };

  // create the container element
  const articleHeader = document.createElement("div");
  articleHeader.classList.add("article-header");

  // constrain the width of text on article pages
  const main = document.querySelector("#main-content");
  main.classList.add("article-content");

  // create the headline group container element
  const headlineGroup = document.createElement("div");
  headlineGroup.classList.add("article-header__headline-group")
  articleHeader.append(headlineGroup);

  // there should always be a title, so create it as an h1
  const pageTitle = document.createElement("h1");
  pageTitle.classList.add("article-header__title");
  pageTitle.innerText = articleHeaderData.title;
  headlineGroup.append(pageTitle);

  // if there is a subtitle, add it as an h2
  if (articleHeaderData.subtitle) {
    const pageSubtitle = document.createElement("p");
    pageSubtitle.classList.add("article-header__subtitle");
    pageSubtitle.innerText = articleHeaderData.subtitle;
    headlineGroup.append(pageSubtitle);
  }

  // if there is either a publication date or author,
  if (articleHeaderData.pubDate || articleHeaderData.author) {
    // create the byline group container element
    const bylineGroup = document.createElement("div");
    bylineGroup.classList.add("article-header__byline-group");
    articleHeader.append(bylineGroup);

    // if there is a publication date,
    if (articleHeaderData.pubDate) {
      // create a time element
      const pubDate = document.createElement("time");
      pubDate.classList.add("article-header__date");
      pubDate.innerText = articleHeaderData.pubDate;

      // find the UTC string of the date string provided
      const pubDateRaw = Date.parse(articleHeaderData.pubDate);
      const preppedDate = new Date(pubDateRaw).toUTCString();

      // add that to our time element
      pubDate.setAttribute('datetime', preppedDate);

      bylineGroup.append(pubDate);
    }

    // if there is an author, build a byline
    if (articleHeaderData.author) {
      const byLine = document.createElement("div");
      byLine.innerHTML = `
        <div class="article-header__byline">Words by</div>
        <div class="article-header__author">${articleHeaderData.author}</div>
      `;
      bylineGroup.append(byLine);
    }
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
      imageCaption.classList.add('image-with-caption__caption');
      imageCaption.innerHTML = articleHeaderData.caption;
      imageContainer.append(imageCaption);
    }

    // replace the parent with our new block and then append the image
    block.parentElement.replaceWith(articleHeader, imageContainer);
  } else {
    // replace the parent with our new block
    block.parentElement.replaceWith(articleHeader);
  }
}
