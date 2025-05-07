import decorateSearch from "../search/search.js";

const buildThemeToggle = () => {
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
  return toggle;
};

export const buildNavToolbar = () => {
  // toolbar wrapper
  const toolbar = document.createElement("div");
  toolbar.classList.add("nav-toolbar", "nav__toolbar");

  // use the existing search component but mock the block
  const search = document.createElement("div");
  decorateSearch(search);
  search.classList.add("search", "nav-toolbar__search");

  // build the toggle
  const toggle = buildThemeToggle();
  toggle.classList.add("nav-toolbar__toggle");

  // apply them in the correct DOM order
  toolbar.append(toggle);
  toolbar.append(search);
  return toolbar;
};
