/**
 * Builds a block of information used for the sticky <section> node on a Careers Listing page.
 *
 * @function
 * @param {string} name
 * @param {string} content
 * @return {string} an HTML <div> node
 */

const buildDetail = ({ name, content }) => {
  if (!content) return;

  const detailContainer = document.createElement('div');
  detailContainer.classList.add('util-listing-detail');

  const detailName = document.createElement('span');
  detailName.classList.add('util-detail-l', 'util-listing-detail__name');
  detailName.textContent = name;
  detailContainer.append(detailName);

  if (name === 'Location') {
    detailContainer.classList.add('util-listing-detail--location');
    detailName.classList.add('util-listing-detail__name--location');
  };

  const contentParts = content.split(',');

  contentParts.forEach((part) => {
    const detailContent = document.createElement('span');
    detailContent.classList.add('util-body-xs', 'util-listing-detail__content');
    detailContent.textContent = part;

    if (name === 'Location') {
      detailContent.classList.add('util-listing-detail__content--location');
    } else {
      detailContent.classList.add('util-details-grid__item');
    }

    detailContainer.append(detailContent);
  });

  return detailContainer;
}

/**
 * Builds a sticky <section> node for use on a Careers Listing page.
 *
 * @function
 * @return {string} an HTML <section> node
 */

export const buildListingDetails = () => {
  const details = [
    {
      name: "Location",
      content: document.querySelector('meta[name="location"]')?.content
    },
    {
      name: "Position type",
      content: document.querySelector('meta[name="position-type"]')?.content
    },
    {
      name: "Req number",
      content: document.querySelector('meta[name="req-number"]')?.content
    },
    {
      name: "Discipline",
      content: document.querySelector('meta[name="discipline"]')?.content
    },
    {
      name: "Team name",
      content: document.querySelector('meta[name="team-name"]')?.content
    },
  ];
  const linkToApply = document.querySelector('meta[name="job-listing"]')?.content;
  const jobTitle = document.querySelector('meta[name="job-title"]')?.content;

  const detailsSection = document.createElement('section');
  detailsSection.classList.add('util-listing-details');

  if (linkToApply) {
    const applyButton = document.createElement('a');
    applyButton.textContent = "Apply now";
    applyButton.title = `Apply to ${jobTitle}`;
    applyButton.classList.add('button', 'button--accent');
    applyButton.href = linkToApply;

    detailsSection.append(applyButton);
  };

  const detailGridContainer = document.createElement('div');
  detailGridContainer.classList.add('util-details-grid');

  details.forEach((detail) => {
    const builtDetail = buildDetail(detail);

    if (detail.name === "Location") {
      detailsSection.append(builtDetail);
    } else {
      detailGridContainer.append(builtDetail);
    };
  });

  if (detailGridContainer.children.length > 1)
    detailsSection.append(detailGridContainer);
  return detailsSection;
}
