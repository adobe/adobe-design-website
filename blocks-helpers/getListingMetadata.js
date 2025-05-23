/**
 * Retreives career listing data from the `<meta>` tags in the `<head>`.
 *
 * @function
 * @return {Object} an object containing career listing data with keys containing { label: string, content: string }
 */

export const getListingMetadata = () => {
  return {
    jobTitle: {
      label: "Job Title",
      content: document.head.querySelector('meta[name="job-title"]')?.content
    },
    location: {
      label: "Location",
      content: document.head.querySelector('meta[name="location"]')?.content
    },
    positionType: {
      label: "Position type",
      content: document.head.querySelector('meta[name="position-type"]')?.content
    },
    reqNumber: {
      label: "Req number",
      content: document.head.querySelector('meta[name="req-number"]')?.content
    },
    discipline: {
      label: "Discipline",
      content: document.head.querySelector('meta[name="discipline"]')?.content
    },
    teamName: {
      label: "Team name",
      content: document.head.querySelector('meta[name="team-name"]')?.content
    },
    jobListing: {
      label: "Job listing",
      content: document.head.querySelector('meta[name="job-listing"]')?.content
    }
  };
}
