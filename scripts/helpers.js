
/**
 * Creates a delay of the provided function, waiting ofr a delay
 * before calling the function again.
 * @function
 * @param {Function} trigger - The function to delay.
 * @returns {Function}
 */
export const debounce = (trigger) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      trigger(...args);
    }, 200);
  };
};
