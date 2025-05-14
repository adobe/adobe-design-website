export default async function decorate(block) {
  // parse data into an object
  const pageHeaderData = {
    title: block.children?.[0]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    image: block.children?.[1]?.children?.[0]?.firstElementChild,
    description: block.children?.[2]?.children?.[0]?.children?.[0]?.innerHTML,
    featuredSubtitle: block.children?.[3]?.children?.[0]?.children?.[0]?.textContent?.trim(),
    featuredDescription: block.children?.[3]?.children?.[1]?.children?.[0]?.textContent?.trim(),
    anchorNode: block.children?.[4]?.children?.[0]?.firstChild?.firstChild,
    buttonStyle: block.children?.[4]?.children?.[1]?.children?.[0]?.textContent?.trim().toLowerCase(),
    altText: block.children?.[4]?.children?.[2]?.children?.[0]?.textContent?.trim(),
  };

  // create the container element
  const pageHeader = document.createElement("div");
  pageHeader.classList.add("page-header", "grid-container");

  const pageHeaderContent = document.createElement("div");
  pageHeaderContent.classList.add("page-header", "grid-item", "grid-item--50");

  // there should always be a title, so create it as an h1
  const pageTitle = document.createElement("h1");
  pageTitle.classList.add("page-header__title", "util-heading-xl");
  pageTitle.innerText = pageHeaderData.title;
  pageHeaderContent.append(pageTitle);

  // if there is a description, add it as an h2
  if (pageHeaderData.description) {
    const pageDescription = document.createElement("div");
    pageDescription.classList.add("page-header__description");

    // if there is a featured subtitle, the description uses
    // a different font class, for visual hierarchy
    pageHeaderData.featuredSubtitle
    ? pageDescription.classList.add("util-title-m", "page-header__description--featured")
    : pageDescription.classList.add("util-body-m");

    pageDescription.innerText = pageHeaderData.description;
    pageHeaderContent.append(pageDescription);
  }

  // if there is a an author block, build that
  if (pageHeaderData.featuredSubtitle) {
    const featuredSubtitleWrapper = document.createElement("div");
    featuredSubtitleWrapper.classList.add("page-header__featured-content");

    const featuredSubtitle = document.createElement("div");
    featuredSubtitle.classList.add("page-header__featured-subtitle", "util-detail-l");
    featuredSubtitle.innerText = pageHeaderData.featuredSubtitle;

    featuredSubtitleWrapper.append(featuredSubtitle);

    if (pageHeaderData.featuredDescription) {
      const featuredDescription = document.createElement("div");
      featuredDescription.classList.add("page-header__featured-description", "util-body-xs");
      featuredDescription.innerText = pageHeaderData.featuredDescription;

      featuredSubtitleWrapper.append(featuredDescription);
    }

    pageHeaderContent.append(featuredSubtitleWrapper);
  }

  // if there's a link, build a button
  if (pageHeaderData.anchorNode) {
    const pageHeaderButton = pageHeaderData.anchorNode;

    pageHeaderButton.classList.add(
      "button",
      "page-header__button",
    );

    pageHeaderData.buttonStyle
      ? pageHeaderButton.classList.add(`button--${pageHeaderData.buttonStyle}`)
      : pageHeaderButton.classList.add("button--primary");

    if (pageHeaderData.altText) {
      pageHeaderButton.setAttribute("aria-label", pageHeaderData.altText);
    }

    pageHeaderContent.append(pageHeaderButton);
  }

  pageHeader.append(pageHeaderContent);

  // if there is an image, add the appropriate attributes
  if (pageHeaderData.image) {
    pageHeaderData.image.classList.add('page-header__image', "grid-item", "grid-item--50");
    pageHeaderData.image.setAttribute('alt', '');
    pageHeader.append(pageHeaderData.image);
  }

  // replace the parent with our new block
  block.parentElement.replaceWith(pageHeader);
}
