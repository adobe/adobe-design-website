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
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
} from './aem.js';

import {
  debounce
} from './helpers.js';

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
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  doc.documentElement.lang = 'en';
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
  }

  sampleRUM.enhance();
}

/**
 * Replaces the header if a user reloads the page.
 * @function
 * @param {Element} doc - The container element
 */
const reloadHeader = (headerElement) => {
  // remove the current header
  headerElement.innerHTML= '';

  // build it again
  loadHeader(headerElement);
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
  loadCSS(`${window.hlx.codeBasePath}/blocks/search/search.css`)

  // loads the header and footer components, along with their stylesheets
  const headerElement = doc.querySelector('header');

  loadHeader(headerElement);

  // supports rerendering of the responsive navigation
  window.addEventListener("resize", debounce(() => reloadHeader(headerElement), 150));

  loadFooter(doc.querySelector('footer'));
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
