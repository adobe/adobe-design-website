/**
 * Loads and decorates the small screen CTA.
 * @function
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const ctaData = {
    description: block.children?.[0]?.children?.[0]?.textContent.trim(),
    url: block.children?.[1]?.children?.[0]?.textContent.trim(),
    anchorLabel: block.children?.[1]?.children?.[1]?.textContent.trim(),
    altText: block.children?.[1]?.children?.[2]?.textContent.trim(),
  };

  // create the cta
  const cta = document.createElement('div');
  cta.classList.add("call-to-action");

  const ctaDescription = document.createElement('div');
  ctaDescription.classList.add("util-title-xl", "call-to-action__description");
  ctaDescription.innerText = ctaData.description;
  cta.append(ctaDescription);

  // prevents broken links; anchors must have urls and labels
  if (ctaData.url && ctaData.anchorLabel) {
    const ctaAnchor= document.createElement('a');

    ctaAnchor.classList.add('button', 'button--accent', "call-to-action__button");
    ctaAnchor.href = ctaData.url;
    ctaAnchor.innerText = ctaData.anchorLabel;

    if (ctaAnchor.altText) ctaAnchor.setAttribute('aria-label', ctaAnchor.altText);

    cta.append(ctaAnchor);
  }

  // replace the parent with our new block
  block.parentElement.replaceWith(cta);
}
