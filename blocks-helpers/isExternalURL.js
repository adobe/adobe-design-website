/**
 * Returns true if a url is external and false if it's a local url.
 * @function
 * @param {string} url a url to check
 * @return {boolean}
 */

export const isExternalURL = (url) => {
  if (
    url.startsWith("https://adobe.design/") ||
    url.startsWith(window.location.origin)
  )
    return false;
  else return true;
}
