export default async function decorate(block) {
  const [quotation, attribution, attributionUrl] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');

  // Append quote text, within paragraph(s). May contain links.
  if (quotation?.children?.length > 0) {
    Array.from(quotation.children).forEach(textElement => {
      const quoteText = document.createElement('p');
      quoteText.className = 'quote__quotation util-heading-quote';
      quoteText.innerHTML = textElement.innerHTML;
      blockquote.append(quoteText);
    });
  }

  // Append optional paragraph with attribution text and link.
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
