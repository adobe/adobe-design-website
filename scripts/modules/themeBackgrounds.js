import { allShapes } from "../../assets/themes/shapes.js";

/**
 * Adds inline SVGs needed for the different hero page backgrounds within some themes.
 * Appends a container element containing the SVG elements.
 * 
 * These are added as their own elements instead of in `background-image` because their
 * fill colors are changed with CSS between themes and light/dark.
 * 
 * @param {string} theme - The name of the current theme (as stored in metadata).
 */
export async function decorateThemeBackgroundVisuals(theme) {
    if (!theme) return;

    // Array of SVG strings to load per theme name.
    const graphicsMapping = {
        'hero-indigo': [allShapes.roundedDiamond],
        'hero-green': [allShapes.roundedDiamond],
    };

    // Return if theme does not need any SVGs.
    if (!Object.keys(graphicsMapping).includes(theme)) {
        return;
    }

    // Create presentation only container that holds SVGs, and append to the body.
    const backgroundVisuals = document.createElement('div');
    backgroundVisuals.className = 'bg-visuals';
    backgroundVisuals.setAttribute('aria-hidden', 'true');

    // Parse the SVG strings and append the necessary SVGs to the container, per theme.
    const parser = new DOMParser();
    graphicsMapping[theme].forEach(svgString => {
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = svgDoc?.documentElement;
        if (svgElement) backgroundVisuals.appendChild(svgElement);
    });

    // Append our container to the body.
    document.body.appendChild(backgroundVisuals);
}