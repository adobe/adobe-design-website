/**
 * Display a single job listing item.
 * @param {Element} block 
 */
export default function decorate(block) {
  const jobListing = document.createElement('a');
  jobListing.className = 'job-listing';

  const row = block.firstElementChild;
  if (row) {
    // Content settings, from each column.
    const [title, subheading, detail] = row.children;
    
    const contentWrapper = document.createElement('span');
    contentWrapper.className = 'job-listing__content';

    if (title) {
      const titleEl = document.createElement('span');
      titleEl.className = 'job-listing__title';
      titleEl.textContent = title.textContent;
      contentWrapper.append(titleEl);

      // Job link from linked title text.
      const href = title.querySelector('a')?.href;
      if (href) {
        jobListing.href = href;
      }
    }

    if (subheading) {
      const subheadingEl = document.createElement('span');
      subheadingEl.className = 'job-listing__subheading';
      subheadingEl.textContent = subheading.textContent;
      contentWrapper.append(subheadingEl);
    }

    if (detail) {
      const detailEl = document.createElement('span');
      detailEl.className = 'job-listing__detail';
      detailEl.textContent = detail.textContent;
      contentWrapper.append(detailEl);
    }

    jobListing.append(contentWrapper);
  }

  block.textContent = '';
  block.replaceWith(jobListing);
}
