export default async function decorate(block) {
  const [quotation, attribution, attributionUrl] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');

  const quoteText = document.createElement('p');
  quoteText.className = 'quote__quotation';
  quoteText.innerHTML = quotation.innerHTML;
  blockquote.append(quoteText);

  if (attribution) {
    const attributionText = document.createElement('p');
    attributionText.className = 'quote__attribution util-detail-s';
    const cite = document.createElement('cite');
    
    if (attributionUrl) {
      const link = document.createElement('a');
      link.href = attributionUrl.textContent;
      link.textContent = attribution.textContent;
      cite.append(link);
    } else {
      cite.textContent = attribution.textContent;
    }
    
    attributionText.append(cite);
    blockquote.append(attributionText);
  }

  block.innerHTML = '';
  block.append(blockquote);
}
