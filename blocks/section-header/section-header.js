export default async function decorate(block) {
  // parse data into an object
  const sectionHeaderData = {
    heading: block.children[0].children[0].children[0],
    description:
      block.children[1]?.children[0]?.children[0]?.textContent?.trim(),
    url: block.children[2]?.children[0]?.children[0]?.textContent?.trim(),
    buttonLabel: block.children[2]?.children[1]?.children[0]?.textContent?.trim(),
    altText: block.children[2]?.children[2]?.children[0]?.textContent?.trim(),
  };

  // create the block
  const sectionHeader = document.createElement("div");
  sectionHeader.classList.add("section-header", "grid-container");

  sectionHeaderData.heading.classList.add(
    "section-header__heading",
    "grid-item",
    "grid-item--100"
  );
  sectionHeader.append(sectionHeaderData.heading);

  // if there's a description, stick it in a p element
  if (sectionHeaderData.description) {
    const sectionDescription = document.createElement("p");
    sectionDescription.classList.add(
      "section-header__description",
      "util-constrained-text",
      "grid-item",
      "grid-item--66"
    );
    sectionDescription.innerText = sectionHeaderData.description;
    sectionHeader.append(sectionDescription);
  }

  // if there's a link, build a button
  if (sectionHeaderData.url && sectionHeaderData.buttonLabel) {
    const sectionHeaderButton = document.createElement("a");
    sectionHeaderButton.classList.add(
      "button",
      "button--primary-outline",
      "section-header__button",
      "grid-item",
      "grid-item--33"
    );
    sectionHeaderButton.href = sectionHeaderData.url;
    sectionHeaderButton.innerText = sectionHeaderData.buttonLabel;

    if (sectionHeaderData.altText) {
      sectionHeaderButton.setAttribute("aria-label", sectionHeaderData.altText);
    }
    sectionHeader.append(sectionHeaderButton);
  }

  // replace the parent to avoid excess elements
  block.parentElement.replaceWith(sectionHeader);
}
