// takes a URL string and prepares it to be used as a URL slug
// by making it lower case, removing non-alphanumeric characters,
// and replacing spaces with dashes

export const prepURL = (string) => {
  const slug = string
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, "-");
  return slug;
};
