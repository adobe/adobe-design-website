/**
 * Checks if the user is on an index page, which always ends in a
 * trailing slash on the website.
 *
 * @function
 * @param {string} path - The parent pathname to check against
 * @returns {boolean}
 */
export const isIndexPageOf = (path) => {
  const currentPathname = window.location.pathname;
  return currentPathname === `/${path}/`;
}

/**
 * Checks if the user is on a sub-page, which does not end in a
 * trailing slash on the website.
 *
 * @function
 * @param {string} path - The parent pathname to check against
 * @returns {boolean}
 */
export const isSubPageOf = (path) => {
  const currentPathname = window.location.pathname;
  return currentPathname.startsWith(`/${path}/`) && !currentPathname.endsWith('/');
}
