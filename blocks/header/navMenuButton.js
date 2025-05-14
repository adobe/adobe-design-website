import { NAV_MENU_ICON_OPEN } from "./navMenuIcons.js";

/**
 * Creates a functional menu button for small screen sizes.
 * @function
 * @returns {Element}
 */

export const buildMenuButton = () => {
  const menuButton = document.createElement("button");
  menuButton.classList.add("nav__menu-button");
  menuButton.setAttribute("aria-controls", "nav");
  menuButton.setAttribute("aria-label", "toggle navigation menu");
  menuButton.innerHTML = NAV_MENU_ICON_OPEN;

  menuButton.setAttribute("aria-expanded", "false");

  return menuButton;
}
