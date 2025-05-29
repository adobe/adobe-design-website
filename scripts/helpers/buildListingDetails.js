/**
 * Builds a block of information used for the sticky <section> node on a Careers Listing page.
 *
 * @function
 * @param {string} name
 * @param {string} content
 * @return {string|undefined} an HTML <div> node
 */

const buildDetail = ({ label, content }) => {
  if (!content) return;

  const detailContainer = document.createElement('div');
  detailContainer.classList.add('util-listing-detail');

  const detailName = document.createElement('span');
  detailName.classList.add('util-detail-l', 'util-listing-detail__name');
  detailName.textContent = label;
  detailContainer.append(detailName);

  if (label === 'Location') {
    detailContainer.classList.add('util-listing-detail--location');
    detailName.classList.add('util-listing-detail__name--location');
  };

  const contentParts = content.split(',');

  contentParts.forEach((part) => {
    const detailContent = document.createElement('span');
    detailContent.classList.add('util-body-xs', 'util-listing-detail__content');
    detailContent.textContent = part;

    if (label === 'Location') {
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
 * @param {Object} metadata
 * @return {string} an HTML <section> node
 */

export const buildListingDetails = (metadata) => {
  const details = [
    metadata.location,
    metadata.positionType,
    metadata.reqNumber,
    metadata.discipline,
    metadata.teamName
  ];
  const linkToApply = metadata.jobListing.content;
  const jobTitle = metadata.jobTitle.content;

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

    if (!builtDetail) return;

    if (detail.label === "Location") {
      detailsSection.append(builtDetail);
    } else {
      detailGridContainer.append(builtDetail);
    };
  });

  if (detailGridContainer?.children.length > 1)
    detailsSection.append(detailGridContainer);
  return detailsSection;
}
