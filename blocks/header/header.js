import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";
import { buildSkipLink } from "../../blocks-helpers/skipLinks.js";
import { buildNavToolbar } from "./navToolbar.js";
import { buildPageLinks } from "./navPageLinks.js";
import { buildHomePageLink } from "./navHomeLink.js";
import { buildMenuButton } from "./navMenuButton.js";

// media query match that indicates mobile/tablet width
const isLargeScreen = window.matchMedia("(min-width: 65.5rem)");

/**
 * Loads and decorates the header navigation.
 * @function
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  // load nav content
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  // decorate nav
  block.textContent = "";
  const nav = document.createElement("nav");
  nav.id = "nav";
  nav.classList.add("nav");

  // insert the bypass block
  nav.append(buildSkipLink());

  // grab the fragments from the file
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // apply some utility classes to those fragments so we can target the elements
  const classes = ["skip-link", "home-link", "page-links", "tools"];

  classes.forEach((sectionName, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav__${sectionName}`);
  });

  // first make the home-link and decorate it
  const navHomeLink = nav.querySelector(".nav__home-link");
  const navHomeLinkAnchor = navHomeLink.querySelector("a");
  const homepageLink = buildHomePageLink(navHomeLinkAnchor);
  navHomeLink.remove();

  // then make the page-links and decorate those
  const navPageLinks = nav.querySelector(".nav__page-links");
  const pageLinkList = navPageLinks.querySelectorAll('a');
  const pageLinks = buildPageLinks(pageLinkList);
  navPageLinks.remove();

  // create the nav tools and place them
  const navTools = nav.querySelector(".nav__tools");
  const toolbar = buildNavToolbar();
  navTools.remove();

  // if large screens, build the large screen nav
  // otherwise, build the small screen nav
  if (isLargeScreen.matches) {
    nav.append(homepageLink, pageLinks, toolbar);
  } else {
    // on small screens we'll want a menu button
    const menuButton = buildMenuButton();

    // and a menu panel
    const menuPanel = document.createElement("div");
    menuPanel.classList.add("nav__menu");
    menuPanel.append(pageLinks, toolbar);

    nav.append(homepageLink, menuButton, menuPanel);
  }

  // add a wrapper for styling
  const navWrapper = document.createElement("div");
  navWrapper.classList.add("nav-wrapper");
  navWrapper.append(nav);

  block.replaceWith(navWrapper);
}
