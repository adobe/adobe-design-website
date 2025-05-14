import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";
import { buildSkipLink } from "../../blocks-helpers/skipLinks.js";
import { buildNavToolbar } from "./nav-toolbar.js";
import { buildPageLinks } from "./nav-page-links.js";
import { buildHomePageLink } from "./nav-home-link.js";

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia("(min-width: 65.5rem)");

function closeOnEscape(e) {
  if (e.code === "Escape") {
    const nav = document.getElementById("nav");
    const navPageLinks = nav.querySelector(".nav__page-links");
    const navSectionExpanded = navPageLinks.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navPageLinks);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navPageLinks);
      nav.querySelector("button").focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navPageLinks = nav.querySelector(".nav__page-links");
    const navSectionExpanded = navPageLinks.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navPageLinks, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navPageLinks, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === "nav-drop";
  if (isNavDrop && (e.code === "Enter" || e.code === "Space")) {
    const dropExpanded = focused.getAttribute("aria-expanded") === "true";
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest(".nav__page-links"));
    focused.setAttribute("aria-expanded", dropExpanded ? "false" : "true");
  }
}

function focusNavSection() {
  document.activeElement.addEventListener("keydown", openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  // TODO: refactor in nav work
  sections
    .querySelectorAll(".nav__page-links .default-content-wrapper > ul > li")
    .forEach((section) => {
      section.setAttribute("aria-expanded", expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navPageLinks The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navPageLinks, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute("aria-expanded") === "true";
  const button = nav.querySelector(".nav__hamburger button");
  document.body.style.overflowY = expanded || isDesktop.matches ? "" : "hidden";
  nav.setAttribute("aria-expanded", expanded ? "false" : "true");
  toggleAllNavSections(
    navPageLinks,
    expanded || isDesktop.matches ? "false" : "true"
  );
  button.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation"
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navPageLinks.querySelectorAll(".nav__drop");
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute("tabindex")) {
        drop.setAttribute("tabindex", 0);
        drop.addEventListener("focus", focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute("tabindex");
      drop.removeEventListener("focus", focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener("keydown", closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener("focusout", closeOnFocusLost);
  } else {
    window.removeEventListener("keydown", closeOnEscape);
    nav.removeEventListener("focusout", closeOnFocusLost);
  }
}

// function getDirectTextContent(menuItem) {
//   const menuLink = menuItem.querySelector(':scope > a');
//   if (menuLink) {
//     return menuLink.textContent.trim();
//   }
//   return Array.from(menuItem.childNodes)
//     .filter((n) => n.nodeType === Node.TEXT_NODE)
//     .map((n) => n.textContent)
//     .join(' ');
// }

/**
 * loads and decorates the header, mainly the nav
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

  // const layoutOpeningTags = Array.from(element.querySelectorAll('p'))
  //   .filter((p) => p.textContent.trim().startsWith('-layout'));

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
  navHomeLink.replaceWith(homepageLink);

  // then make the page-links and decorate those
  const navPageLinks = nav.querySelector(".nav__page-links");
  const pageLinkList = navPageLinks.querySelectorAll('a');
  const pageLinks = buildPageLinks(pageLinkList);
  navPageLinks.replaceWith(pageLinks);

  // if (navPageLinks) {
  //   navPageLinks.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
  //     if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
  //     navSection.addEventListener('click', () => {
  //       if (isDesktop.matches) {
  //         const expanded = navSection.getAttribute('aria-expanded') === 'true';
  //         toggleAllNavSections(navPageLinks);
  //         navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  //       }
  //     });
  //   });
  // }

  // create the nav tools and place them
  const navTools = nav.querySelector(".nav__tools");
  const toolbar = buildNavToolbar();

  navTools.replaceWith(toolbar);

  // on small screens we'll want a hamburger menu
  const hamburger = document.createElement("div");
  hamburger.classList.add("nav__hamburger");
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;
  hamburger.addEventListener("click", () => toggleMenu(nav, navPageLinks));
  nav.prepend(hamburger);
  nav.setAttribute("aria-expanded", "false");

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navPageLinks, isDesktop.matches);
  isDesktop.addEventListener("change", () =>
    toggleMenu(nav, navPageLinks, isDesktop.matches)
  );

  // add a wrapper for styling
  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";

  // put our nav inside the wrapper
  navWrapper.append(nav);

  block.replaceWith(navWrapper);
}
