export default async function decorate(block) {
  const [quotation, attribution, attributionUrl] = [...block.children].map((child) => child.firstElementChild);
  const blockquote = document.createElement('blockquote');

  quotation.className = 'quote-quotation';
  blockquote.append(quotation);

  if (attribution) {
    attribution.className = 'quote-attribution';
    const cite = document.createElement('cite');
    const attributionText = document.createElement('p');
    
    if (attributionUrl) {
      const link = document.createElement('a');
      link.href = attributionUrl.textContent;
      link.innerHTML = attribution.innerHTML;
      attributionText.append(link);
    } else {
      attributionText.innerHTML = attribution.innerHTML;
    }
    
    cite.append(attributionText);
    attribution.innerHTML = '';
    attribution.append(cite);
    blockquote.append(attribution);
  }

  block.innerHTML = '';
  block.append(blockquote);
}
