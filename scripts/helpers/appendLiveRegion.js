/**
 * Add an aria-live region to the DOM. Run as early as possible.
 */
export const appendLiveRegion = () => {
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.classList.add("util-visually-hidden");
  liveRegion.id = "live-region";
  document.body.append(liveRegion);
};
