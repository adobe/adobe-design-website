/**
 * Breakpoint ranges. Should match what is used in the CSS.
 */
const breakpointQueries = [
  ['sm', '(max-width: 22.49999rem)'],
  ['md', '(min-width: 22.5rem) and (max-width: 79.9999rem)'],
  ['lg', '(min-width: 80rem) and (max-width: 104.9999rem)'],
  ['xl', '(min-width: 105rem)']
];

/**
 * Check which breakpoint we're at in the viewport.
 * @returns {string} The breakpoint size name.
 */
export const getCurrentBreakpoint = () => {
  // The first matching query wins
  for (const [name, query] of breakpointQueries) {
    if (window.matchMedia(query).matches) return name;
  }
  return 'sm';
};
