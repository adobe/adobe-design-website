import { dataStore } from "../../scripts/helpers/index.js";

const DEFAULT_CONTENT = {
  noJobs: "There are no jobs currently available."
};

const HEADING_LEVEL = "h3";

/**
 * Display a list of jobs, under heading(s) for each discipline.
 * 
 * Jobs are dynamically listed using query-index data pulled from the careers directory.
 * The list of disciplines is entered in the content to allow for manual ordering.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  /**
   * Discipline headings from each row of content.
   * @type {string[]}
   */
  const headings = [...block.children].map((el) => el.textContent.trim()).filter(Boolean);

  // Create container.
  const blockContainer = document.createElement('div');
  blockContainer.classList.add('job-list-block');
  blockContainer.textContent = "";

  // Replace wrapper div parent with new block.
  block?.parentElement?.classList?.length === 0 ? block.parentElement.replaceWith(blockContainer) : block.replaceWith(blockContainer);

  // Fetch the dynamic job data async, create markup, and append to the container.
  (async () => {
    // Get jobs data from endpoint.
    const jobsData = await dataStore.getData(dataStore.commonEndpoints.careers);

    // Filter only the ones with disciplines that are displayed.
    const allJobsForDisplay = jobsData?.data?.length
      ? jobsData.data.filter(job => job?.jobDiscipline && headings.includes(job.jobDiscipline))
      : [];

    // If no jobs, display null state message.
    if (!allJobsForDisplay.length) {
      blockContainer.classList.remove('grid-container');
      const message = document.createElement('p');
      message.textContent = DEFAULT_CONTENT.noJobs;
      blockContainer.append(message);
      return;
    }

    // Newly created elements that will be appended to blockContainer when finished.
    const allJobMarkup = document.createDocumentFragment();

    // Loop through each discipline.
    headings.forEach(heading => {
      /**
       * Jobs with this discipline in metadata
       * @type {object[]}
       */
      const jobs = jobsData?.data?.filter(job => job?.jobDiscipline == heading) ?? [];
      if (!jobs.length) { return; }

      // Container with heading and job list.
      const jobGrouping = document.createElement('div');
      jobGrouping.classList.add('job-list','grid-container');

      // Heading element.
      const headingElement = document.createElement(HEADING_LEVEL);
      headingElement.classList.add('job-list__heading', 'util-heading-s', 'grid-item', 'grid-item--33');
      headingElement.textContent = heading;

      // Job list under this heading.
      const jobsListingsWrap = document.createElement('ul');
      jobsListingsWrap.classList.add('job-list__listings', 'grid-item', 'grid-item--66');

      // Display each job (using "job-listing" component styles).
      jobs.forEach(row => {
        const {jobTitle, department, location, path} = row;

        const jobListItem = document.createElement('li');
        const jobItem = document.createElement('a');
        jobItem.classList.add('job-listing');
        jobListItem.append(jobItem);

        // Link to job page.
        if (path) {
          jobItem.href = path.trim();
        }

        const contentWrapper = document.createElement('span');
        contentWrapper.classList.add('job-listing__content');
        jobItem.append(contentWrapper);

        if (jobTitle) {
          const titleEl = document.createElement('span');
          titleEl.classList.add('job-listing__title');
          titleEl.textContent = jobTitle.trim();
          contentWrapper.append(titleEl);
        }

        if (department) {
          const subheadingEl = document.createElement('span');
          subheadingEl.classList.add('job-listing__subheading');
          subheadingEl.textContent = department.trim();
          contentWrapper.append(subheadingEl);
        }

        if (location) {
          const detailEl = document.createElement('span');
          detailEl.classList.add('job-listing__detail');
          detailEl.textContent = location.trim();
          contentWrapper.append(detailEl);
        }

        // Append job.
        jobsListingsWrap.append(jobListItem);
      });

      // Append grouping with heading and its jobs.
      jobGrouping.append(headingElement, jobsListingsWrap);
      allJobMarkup.append(jobGrouping);
    });

    // Append all new elements to the main block container.
    blockContainer.append(allJobMarkup);
  })();
}
