/**
 * Loads and decorates an image with optional caption.
 * @function
 * @param {Element} block The image-with-caption block element
 */

export default function decorate(block) {
  const imageData = {
    firstImage: block.children?.[0]?.children?.[0]?.firstElementChild,
    secondImage: block.children?.[0]?.children?.[1]?.firstElementChild,
    caption: block.children?.[1]?.children?.[0]?.textContent?.trim(),
    altText: block.children?.[2]?.children?.[0]?.textContent?.trim(),
    secondAltText: block.children?.[2]?.children?.[1]?.textContent?.trim(),
    fullWidth: block.children?.[3]?.children?.[0]?.textContent?.trim(),
  };

  const imageContainer = document.createElement('figure');
  imageContainer.classList.add('image-with-caption');

  if (imageData.fullWidth) imageContainer.classList.add('image-with-caption--full-width');

  imageData.firstImage.classList.add('image-with-caption__image');
  if (imageData.altText) imageData.firstImage.setAttribute('alt', imageData.altText);
  imageContainer.append(imageData.firstImage);

  if (imageData.secondImage) {
    imageContainer.classList.add('image-with-caption', 'image-with-caption--two-up');
    imageData.secondImage.classList.add('image-with-caption__image', 'image-with-caption__image--secondary');
    if (imageData.secondAltText) imageData.secondImage.setAttribute('alt', imageData.secondAltText);
    imageContainer.append(imageData.secondImage);
  }

  if (imageData.caption) {
    const imageCaption = document.createElement('figcaption');
    imageCaption.classList.add('util-detail-s', 'image-with-caption__caption');
    imageCaption.innerText = imageData.caption;
    imageContainer.append(imageCaption);
  }

  block.parentElement.replaceWith(imageContainer);
}
