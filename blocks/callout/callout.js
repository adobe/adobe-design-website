import { cleanText } from "../../scripts/helpers/index.js";

const PAPER_PLANE_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" fill="none" viewBox="0 0 26 26">
    <mask id="a" width="26" height="26" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
      <path fill="#FFF" d="M24.414 2.085a.975.975 0 0 0-1.047-.216l-21.45 8.462a.973.973 0 0 0-.118 1.757l8.132 4.543 4.578 8.076a.977.977 0 0 0 1.755-.127l8.37-21.45a.975.975 0 0 0-.22-1.045ZM19.72 5.403l-9.246 9.298-5.927-3.312L19.72 5.403Zm-4.526 16.558-3.336-5.885 9.267-9.317-5.93 15.202Z"/>
    </mask>
    <g mask="url(#a)">
      <path fill="#fff" fill-opacity=".85" d="M0 .5h26v26H0z"/>
    </g>
  </svg>
`;

export default async function decorate(block) {
  const calloutData = {
    title: block.children[0].children[0].textContent.trim(),
    description: block.children[0].children[1].children,
    url: block.children[1].children[0].textContent.trim(),
    buttonLabel: block.children[1].children[1].textContent.trim(),
    altText: block.children[1].children[2].textContent.trim(),
  };

  let calloutBlock;
  let calloutButton = null;

  // Create container element
  const calloutContainer = document.createElement("div");
  calloutContainer.classList.add("callout-container");

  // Populate callout content
  const calloutContent = document.createElement("div");
  calloutContent.classList.add("callout__content");

  // ...remove any automatic heading tag from title text
  const calloutTitle = document.createElement("span");
  calloutTitle.classList.add("callout__title");
  calloutTitle.textContent = calloutData.title;
  calloutContent.append(calloutTitle);

  // ...remove semantic tags from description text
  cleanText(calloutData.description, calloutContent);

  if (calloutData.url && calloutData.buttonLabel) {
    // The callout has a button; the rest of the block is not interactive
    calloutBlock = document.createElement("div");
    calloutButton = document.createElement("a");
    calloutButton.classList.add("button", "button--static-white");
    calloutButton.href = calloutData.url;
    calloutButton.innerHTML = `
      ${PAPER_PLANE_ICON_SVG}
      <span>${calloutData.buttonLabel}</span>
    `;
    if (calloutData.altText) calloutButton.setAttribute("aria-label", calloutData.altText);
  } else if (calloutData.url && !calloutData.buttonLabel) {
    // The callout as a whole is interactive
    calloutBlock = document.createElement("a");
    calloutBlock.classList.add("callout--with-link");
    calloutBlock.href = calloutData.url;
    if (calloutData.altText) calloutButton.setAttribute("aria-label", calloutData.altText);
  } else {
    // The callout is non-interactive
    calloutBlock = document.createElement("div");
  };

  calloutBlock.classList.add("callout");
  calloutBlock.append(calloutContent);
  if (calloutButton) calloutBlock.append(calloutButton);
  calloutContainer.append(calloutBlock);

  block.replaceWith(calloutContainer);
}
