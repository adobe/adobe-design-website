/**
 * Creates a delay of the provided function, waiting ofr a delay
 * before calling the function again.
 * @function
 * @param {Function} trigger - The function to delay.
 * @param {Number} timeout - The number of milliseconds to wait prior to rerun.
 * @returns {Function}
 */
export const debounce = (trigger, timeout = 200) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      trigger(...args);
    }, timeout);
  };
};

/**
 * Removes the trailing slash from a pathname.
 * 
 * @function
 * @returns {string}
 */
const normalizePathname = () => {
  const pathname = window.location.pathname;
  
  // Remove the trailing slash
  return pathname.replace(/\/$/, "");
}

/**
 * Checks if the user is on an index page
 * 
 * @function
 * @param {string} path - The pathname to check against
 * @returns {boolean}
 */
export const checkPage = (path) => {
  const normalizedPathname = normalizePathname();
  
  // The path "/ideas/" is the Ideas index page, so the normalized pathname will result in "/ideas"
  return normalizedPathname === path;
}

/**
 * Checks if the user is on a sub-page
 * 
 * @function
 * @param {string} path - The pathname to check against
 * @returns {boolean}
 */
export const checkSubPage = (path) => {
  const normalizedPathname = normalizePathname();
  
  // The path "/ideas/article-name" is a sub-page of Ideas, so the normalized pathname should start with "/ideas/"
  return normalizedPathname.startsWith(path);
}
