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
  const calloutContainer = document.createElement('div');
  calloutContainer.classList = 'callout-container';

  // Populate callout content
  const calloutContent = document.createElement('div');
  calloutContent.classList = 'callout__content';

  // ...remove any automatic heading tag from title text
  const calloutTitle = document.createElement('span');
  calloutTitle.classList = 'callout__title';
  calloutTitle.textContent = calloutData.title;
  calloutContent.append(calloutTitle);

  // ...remove semantic tags from description text
  [...calloutData.description].forEach((textNode) => {
    const calloutDescriptionPart = document.createElement('span');
    calloutDescriptionPart.textContent = textNode.textContent.trim();
    calloutContent.append(calloutDescriptionPart);
  });

  if (calloutData.url && calloutData.buttonLabel) {
    // The callout is non-interactive, but has a link button
    calloutBlock = document.createElement('div');
    calloutButton = document.createElement('a');
    calloutButton.classList = 'button button--static-white';
    calloutButton.href = calloutData.url;
    calloutButton.innerHTML = `
      <svg width="26" height="27" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_1480_1486" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26">
        <path d="M24.4136 2.08485C24.1381 1.81063 23.728 1.72685 23.3675 1.86903L1.91747 10.3305C1.56708 10.4676 1.32842 10.7964 1.30301 11.1722C1.27761 11.5479 1.4706 11.9047 1.79941 12.0875L9.93075 16.6311L14.5087 24.7066C14.6826 25.0126 15.0076 25.2005 15.3567 25.2005C15.3796 25.2005 15.4037 25.1992 15.4265 25.1979C15.8023 25.1713 16.1286 24.9301 16.2644 24.5797L24.6332 3.12968C24.7741 2.76913 24.6878 2.3578 24.4136 2.08485ZM19.7203 5.4034L10.4735 14.7005L4.54667 11.3892L19.7203 5.4034ZM15.1942 21.9606L11.8579 16.076L21.1248 6.75863L15.1942 21.9606Z" fill="#FFFFFF"/>
      </mask>
      <g mask="url(#mask0_1480_1486)">
        <rect y="0.5" width="26" height="26" fill="white" fill-opacity="0.85"/>
      </g>
      </svg>
      <span>${calloutData.buttonLabel}</span>
    `;
    if (calloutData.altText) calloutButton.title = calloutData.altText;
  } else if (calloutData.url && !calloutData.buttonLabel) {
    // The callout as a whole is interactive
    calloutBlock = document.createElement('a');
    calloutBlock.classList = 'callout--link';
    calloutBlock.href = calloutData.url;
    if (calloutData.altText) calloutButton.title = calloutData.altText;
  } else {
    // The callout is non-interactive
    calloutBlock = document.createElement('div');
  };

  calloutBlock.classList.add('callout');
  calloutBlock.append(calloutContent);
  if (calloutButton) calloutBlock.append(calloutButton);
  calloutContainer.append(calloutBlock);

  block.replaceWith(calloutContainer);
}
