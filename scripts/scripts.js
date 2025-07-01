import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateHorizontalRules,
  decorateLayouts,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  cleanEmptyDivs,
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
} from './aem.js';
import {
  debounce,
  isSubPageOf,
  buildArticlePage,
  buildCareersListingPage,
  buildSiteContentPage,
  appendLiveRegion,
} from './helpers/index.js';
import { largeScreenMediaQuery } from '../blocks/header/header.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const heroImage = picture.querySelector('img');
    heroImage.classList.add('hero__picture');
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function autolinkModals(doc) {
  doc.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');
    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateHorizontalRules(main),
  decorateIcons(main),
  buildAutoBlocks(main),
  decorateSections(main),
  decorateBlocks(main),
  decorateLayouts(main);
}

/**
 * Rebuilds and replaces the header.
 * @function
 * @param {Element} headerElement - The header's container element.
 * @param {boolean} onBreakpointChangeOnly - Only rebuild when the header has changed between small and large.
 */
const reloadHeader = async (headerElement, onBreakpointChangeOnly = false) => {
  if (onBreakpointChangeOnly) {
    // Compare current screen size and the state of the current nav.
    const isLargeScreen = window.matchMedia(largeScreenMediaQuery).matches;
    const isCurrentNavLarge = headerElement.querySelector(".nav--large-screens") !== null;
    if (isLargeScreen === isCurrentNavLarge) {
      return;
    }
  }

  // Build it again.
  const tempHeader = document.createDocumentFragment();
  await loadHeader(tempHeader);

  // Keep existing color scheme setting to avoid a brief flash.
  const colorSchemeValue = document.getElementById("color-scheme")?.checked;
  if (typeof colorSchemeValue !== "undefined") {
    const newColorSchemeInput = tempHeader.getElementById("color-scheme");
    if (newColorSchemeInput) newColorSchemeInput.checked = colorSchemeValue;
  }

  // Make sure page is scrollable if mobile menu was previously open.
  document.body.classList.remove("js-no-scroll");

  headerElement.replaceChildren(tempHeader);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  doc.documentElement.lang = 'en';
  appendLiveRegion();
  decorateTemplateAndTheme();
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    doc.body.dataset.breadcrumbs = true;
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    main.id = "main-content";
    doc.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);

    // loads the header component, along with its stylesheet
    const headerElement = doc.querySelector('header');
    loadHeader(headerElement);
  }

  sampleRUM.enhance();
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  // loads our standard styles and important root variables
  loadCSS(`${window.hlx.codeBasePath}/styles/base.css`);
  loadCSS(`${window.hlx.codeBasePath}/styles/styles.css`);
  loadCSS(`${window.hlx.codeBasePath}/styles/global-blocks.css`);

  // decorate page-specific components
  // decorate article page
  if (isSubPageOf('ideas')) {
    const isArticle = Boolean(document.querySelector("main.article-content"));
    if (isArticle) buildArticlePage();
  };

  // decorate careers listing page
  if (isSubPageOf('careers')) buildCareersListingPage();

  // decorate site content page
  if (window.location.pathname === "/pattern-library/site-content") buildSiteContentPage();

  // supports rerendering of the responsive navigation
  const headerElement = doc.querySelector('header');
  window.addEventListener("resize", debounce(() => reloadHeader(headerElement, true), 150));

  // loads the footer component, along with its stylesheet
  loadFooter(doc.querySelector('footer'));
  cleanEmptyDivs(main);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here

  loadCSS(`${window.hlx.codeBasePath}/styles/delayed-styles.css`);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
