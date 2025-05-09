export default function decorate(block) {
  const jobList = document.createElement('div');
  jobList.className = 'job-list';

  const [departmentRow, ...jobRows] = [...block.children];
  
  if (departmentRow) {
    const departmentTitle = document.createElement('h2');
    departmentTitle.className = 'job-list__department util-heading-s';
    departmentTitle.textContent = departmentRow.textContent;
    jobList.append(departmentTitle);
  }

  const jobListings = document.createElement('div');
  jobListings.className = 'job-list__listings';

  jobRows.forEach(row => {
    const [title, department, location, jobId] = row.children;
    
    const jobListing = document.createElement('a');
    jobListing.className = 'job-listing';
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'job-listing__content';
    
    if (title) {
      const titleE = document.createElement('h3');
      titleE.className = 'job-listing__title';
      titleE.textContent = title.textContent;
      contentWrapper.append(titleE);
    }

    if (department) {
      const departmentEl = document.createElement('p');
      departmentEl.className = 'job-listing__department';
      departmentEl.textContent = department.textContent;
      contentWrapper.append(departmentEl);
    }

    if (location) {
      const locationEl = document.createElement('p');
      locationEl.className = 'job-listing__location';
      locationEl.textContent = location.textContent;
      contentWrapper.append(locationEl);
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
