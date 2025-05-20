import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";
import { buildSkipLink } from "../../blocks-helpers/skipLinks.js";
import {
  buildLargeScreenNavToolbar,
  buildSearch,
  buildSmallScreenNavToolbar,
} from "./navToolbar.js";
import { buildPageLinks } from "./navPageLinks.js";
import { buildHomePageLink } from "./navHomeLink.js";
import { buildMenuButton } from "./navMenuButton.js";
import { createFocusTrap } from "../../blocks-helpers/focusTrap.js";
import { NAV_MENU_ICON_OPEN, NAV_MENU_ICON_CLOSE } from "./navMenuIcons.js";

/**
 * Builds and decorates the large screen navigation.
 * @function
 * @param {Element} nav - Page Navigation.
 * @param {Element} homepageLink - Header link to the homepage.
 * @param {Element} pageLinks - The rest of the links in the navigation menu.
 */
const buildLargeScreenNav = (nav, homepageLink, pageLinks) => {
  const toolbar = buildLargeScreenNavToolbar();
  pageLinks.classList.add("util-body-xs");
  nav.append(homepageLink, pageLinks, toolbar);
};

/**
 * Builds and decorates the large screen navigation.
 * @function
 * @param {Element} nav - Page Navigation.
 * @param {Element} homepageLink - Header link to the homepage.
 * @param {Element} pageLinks - The rest of the links in the navigation menu.
 */
const buildSmallScreenNav = (nav, homepageLink, pageLinks) => {
  // on small screens we'll want some elements
  const menuButton = buildMenuButton();
  const search = buildSearch();
  const toolbar = buildSmallScreenNavToolbar();
  const skipLink = nav.querySelector("#skip-to-main-content-from-header");

  menuButton.setAttribute("aria-expanded", false);

  // TODO update search block
  search.classList.add("search--no-toggle");

  // and a menu panel
  const menuPanel = document.createElement("div");
  menuPanel.classList.add("nav__menu", "nav__menu--closed");

  //style the page links
  pageLinks.classList.add("util-detail-l");

  let isPanelOpen = false;
  let removeNavFocusTrap = null;

  /**
   * Opens the Navigation Menu.
   * @function
   */
  const openNavMenu = () => {
    isPanelOpen = true;

    menuButton.setAttribute("aria-expanded", true);
    menuButton.innerHTML = NAV_MENU_ICON_CLOSE;

    menuPanel.classList.add("nav__menu--open");
    menuPanel.setAttribute("aria-hidden", false);

    skipLink.addEventListener('click', closeNavMenu);

    document.body.classList.add("js-no-scroll");

    // Trap focus inside menu
    removeNavFocusTrap = createFocusTrap(nav);

    document.addEventListener("keydown", handleEscapeKey);
  };

  /**
   * Closes the Navigation Menu. We separate the functions so that only
   * "close" can be called on escape keydown.
   * @function
   */
  const closeNavMenu = () => {
    isPanelOpen = false;

    menuButton.focus();
    menuButton.setAttribute("aria-expanded", false);
    menuButton.innerHTML = NAV_MENU_ICON_OPEN;

    menuPanel.classList.remove("nav__menu--open");
    menuPanel.setAttribute("aria-hidden", true);

    skipLink.removeEventListener('click', closeNavMenu);

    document.body.classList.remove("js-no-scroll");

    // Remove focus trap
    if (removeNavFocusTrap) removeNavFocusTrap();

    document.removeEventListener("keydown", handleEscapeKey);
  };

  /**
   * Pressing the escape key will close the menu.
   * @function
   */
  const handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      closeNavMenu();
    }
  };

  menuButton.addEventListener("click", () => {
    isPanelOpen ? closeNavMenu() : openNavMenu();
  });

  menuPanel.append(search, pageLinks, toolbar);
  nav.append(homepageLink, menuButton, menuPanel);
};

/**
 * Loads and decorates the header navigation.
 * @function
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  // media query match that indicates mobile/tablet width
  const isLargeScreen = window.matchMedia("(min-width: 65.5rem)");

  // load nav content
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  // decorate nav
  block.textContent = "";
  let nav = document.createElement("nav");
  nav.id = "nav";
  nav.classList.add("nav");

  // grab the fragments from the file
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // apply some utility classes to those fragments so we can target the elements
  const classes = ["home-link", "page-links"];

  classes.forEach((sectionName, i = 1) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav__${sectionName}`);
  });

  // first make the home-link and decorate it
  const navHomeLink = nav.querySelector(".nav__home-link");
  const navHomeLinkAnchor = navHomeLink.querySelector("a");
  const homepageLink = buildHomePageLink(navHomeLinkAnchor);

  // then make the page-links and decorate those
  const navPageLinks = nav.querySelector(".nav__page-links");
  const pageLinkList = navPageLinks.querySelectorAll("a");
  const pageLinks = buildPageLinks(pageLinkList);

  // clear out the nav so we can build things well
  nav.innerHTML = "";

  const skipLink = buildSkipLink();
  skipLink.id = "skip-to-main-content-from-header";
  // insert the bypass block
  nav.append(skipLink);

  // if large screens, build the large screen nav
  // otherwise, build the small screen nav
  if (isLargeScreen.matches) {
    buildLargeScreenNav(nav, homepageLink, pageLinks);
  } else {
    buildSmallScreenNav(nav, homepageLink, pageLinks);
  }

  // add a wrapper for styling
  const navWrapper = document.createElement("div");
  navWrapper.classList.add("nav-wrapper");
  navWrapper.append(nav);

  block.replaceWith(navWrapper);
}
