export default function decorate(block) {
  const jobListing = document.createElement('a');
  jobListing.className = 'job-listing';

  const row = block.firstElementChild;
  if (row) {
    const [title, subheading, detail, jobId] = row.children;
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'job-listing__content';
    
    if (title) {
      const titleEl = document.createElement('h2');
      titleEl.className = 'job-listing__title util-title-xl';
      titleEl.textContent = title.textContent;
      contentWrapper.append(titleEl);
    }

    if (subheading) {
      const subheadingEl = document.createElement('p');
      subheadingEl.className = 'job-listing__subheading util-detail-m';
      subheadingEl.textContent = subheading.textContent;
      contentWrapper.append(subheadingEl);
    }

    if (detail) {
      const detailEl = document.createElement('p');
      detailEl.className = 'job-listing__detail util-body-xs';
      detailEl.textContent = detail.textContent;
      contentWrapper.append(detailEl);
    }

    jobListing.append(contentWrapper);

    if (jobId) {
      jobListing.href = `https://adobe.design/jobs/job-posts/${jobId.textContent.trim()}`;
    }
  }

  block.textContent = '';
  block.replaceWith(jobListing);
}
