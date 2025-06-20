import decorateSearch from "../search/search.js";

/**
 * Creates a toggle input that changes color scheme.
 * @function
 * @returns {Element}
 */

export const buildThemeToggle = () => {
  // build a wrapper for the toggle
  const toggle = document.createElement("div");
  toggle.classList.add("theme-toggle");

  // create the label
  const themeSelectLabel = document.createElement("label");
  themeSelectLabel.innerText = "Enable Dark Mode";
  themeSelectLabel.classList.add("theme-toggle__label", "util-detail-m");
  themeSelectLabel.for = "color-scheme";

  // create the input, and check the toggle if a user has system set to dark mode
  const toggleInput = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? `<input type="checkbox" role="switch" class="theme-toggle__input" id="color-scheme" checked>`
    : `<input type="checkbox" role="switch" class="theme-toggle__input" id="color-scheme">`;
  toggle.innerHTML = `
    ${toggleInput}
    <span class="theme-toggle__switch"></span>
  `;

  // all together now
  toggle.append(themeSelectLabel);
  toggle.classList.add("nav-toolbar__toggle");
  return toggle;
};

/**
 * Creates and decorates the Nav Search.
 * @function
 * @returns {Element}
 */

export const buildSearch = () => {
  // use the existing search component but mock the block
  const search = document.createElement("div");
  decorateSearch(search);
  search.classList.add("search", "nav-toolbar__search");

  return search;
};

/**
 * Creates and decorates the Large Screen Nav Toolbar.
 * @function
 * @returns {Element}
 */

export const buildLargeScreenNavToolbar = () => {
  // toolbar wrapper
  const toolbar = document.createElement("div");
  toolbar.classList.add("nav-toolbar", "nav__toolbar");

  // build the toggle
  const toggle = buildThemeToggle();
  const search = buildSearch();

  // apply them in the correct DOM order
  toolbar.append(search, toggle);
  return toolbar;
};

/**
 * Creates and decorates the Small Screen Nav Toolbar, which doesn't have Search.
 * @function
 * @returns {Element}
 */

export const buildSmallScreenNavToolbar = () => {
  // toolbar wrapper
  const toolbar = document.createElement("div");
  toolbar.classList.add("nav-toolbar", "nav__toolbar");

  // section label
  const label = document.createElement("p");
  label.classList.add(
    "nav-toolbar__label",
    "nav__toolbar-label",
    "util-body-s"
  );
  label.innerText = "Accessibility Features";

  // build the toggle
  const toggle = buildThemeToggle();

  // apply them in the correct DOM order
  toolbar.append(label);
  toolbar.append(toggle);
  return toolbar;
};
