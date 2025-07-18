export default async function decorate(block) {
  // Get embed data
  const embed = {
    code: block.children?.[0]?.innerText.trim(),
    caption: block.children?.[1]?.innerText.trim(),
  };

  // Create a figure and populate it with the embed code
  const figure = document.createElement("figure");
  figure.classList.add("embed");
  figure.innerHTML = embed.code;

  // Apply classes to the iframe
  const iframe = figure.querySelector("iframe");
  iframe.classList.add("embed__iframe");
  if (embed.code.includes("spotify")) iframe.classList.add("embed__iframe--no-aspect-ratio");

  // Create a figcaption, if it exists, and append to the figure
  if (embed.caption) {
    const figCaption = document.createElement("figcaption");
    figCaption.className = "embed__caption";
    figCaption.innerHTML = embed.caption;
    figure.appendChild(figCaption);
  }

  block.replaceWith(figure);
}
