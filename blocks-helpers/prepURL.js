/**
 * Takes a URL string and prepares it to be used as a URL slug
 * by making it lower case, removing non-alphanumeric characters,
 * and replacing spaces with dashes.
 * @function
 * @param {string} string - The piece of text to be translated
 * @return {string} in slug format, e.g. url-slug
 */

export const prepURL = (string) => {
  const slug = string
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, "-");
  return slug;
};
