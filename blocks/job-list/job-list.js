export default function decorate(block) {
  const jobList = document.createElement('div');
  jobList.className = 'job-list';

  const [headingRow, ...jobRows] = [...block.children];
  
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.className = 'job-list__heading util-heading-s';
    heading.textContent = headingRow.textContent;
    jobList.append(heading);
  }

  const jobListings = document.createElement('div');
  jobListings.className = 'job-list__listings';

  jobRows.forEach(row => {
    const [title, subheading, detail, jobId] = row.children;
    
    const jobListing = document.createElement('a');
    jobListing.className = 'job-listing';
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'job-listing__content';
    
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'job-listing__title';
      titleEl.textContent = title.textContent;
      contentWrapper.append(titleEl);
    }

    if (subheading) {
      const subheadingEl = document.createElement('p');
      subheadingEl.className = 'job-listing__subheading';
      subheadingEl.textContent = subheading.textContent;
      contentWrapper.append(subheadingEl);
    }

    if (detail) {
      const detailEl = document.createElement('p');
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
  block.replaceWith(jobList);
}
