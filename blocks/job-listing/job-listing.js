export default function decorate(block) {
  const jobListing = document.createElement('a');
  jobListing.className = 'job-listing';

  const row = block.firstElementChild;
  if (row) {
    const [title, department, location, jobId] = row.children;
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'job-listing__content';
    
    if (title) {
      const titleEl = document.createElement('h2');
      titleEl.className = 'job-listing__title util-title-xl';
      titleEl.textContent = title.textContent;
      contentWrapper.append(titleEl);
    }

    if (department) {
      const departmentEl = document.createElement('p');
      departmentEl.className = 'job-listing__department util-detail-m';
      departmentEl.textContent = department.textContent;
      contentWrapper.append(departmentEl);
    }

    if (location) {
      const locationEl = document.createElement('p');
      locationEl.className = 'job-listing__location util-body-xs';
      locationEl.textContent = location.textContent;
      contentWrapper.append(locationEl);
    }

    jobListing.append(contentWrapper);

    if (jobId) {
      jobListing.href = `https://adobe.design/jobs/job-posts/${jobId.textContent.trim()}`;
    }
  }

  block.textContent = '';
  block.replaceWith(jobListing);
}
