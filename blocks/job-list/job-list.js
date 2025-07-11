export default function decorate(block) {
  const jobList = document.createElement('div');
  jobList.classList.add('job-list', 'grid-container');

  const [headingRow, ...jobRows] = [...block.children];

  const heading = headingRow.children?.[0]?.children?.[0];
  if (heading) {
    heading.classList.add('job-list__heading', 'util-heading-s', 'grid-item', 'grid-item--33');
    heading.textContent = headingRow.textContent;
    jobList.append(heading);
  }

  const jobListings = document.createElement('div');
  jobListings.className = 'job-list__listings grid-item grid-item--66';

  jobRows.forEach(row => {
    const [title, subheading, detail, jobId] = row.children;

    const jobListing = document.createElement('a');
    jobListing.className = 'job-listing';

    const contentWrapper = document.createElement('span');
    contentWrapper.className = 'job-listing__content';

    if (title) {
      const titleEl = document.createElement('span');
      titleEl.className = 'job-listing__title';
      titleEl.textContent = title.textContent;
      contentWrapper.append(titleEl);
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

    if (jobId) {
      jobListing.href = `https://adobe.design/jobs/job-posts/${jobId.textContent.trim()}`;
    }

    jobListings.append(jobListing);
  });

  jobList.append(jobListings);
  block.textContent = '';

  // Replace wrapper div parent with new block.
  block?.parentElement?.classList?.length === 0 ? block.parentElement.replaceWith(jobList) : block.replaceWith(jobList);;
}
