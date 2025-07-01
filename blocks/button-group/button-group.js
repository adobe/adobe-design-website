export default async function decorate(block) {
  const buttons = [...block.children].map((row) => ({
    anchorNode: row.children?.[0]?.firstChild?.firstChild,
    buttonStyle: row.children?.[1]?.firstChild?.innerText.trim(),
    altText: row.children?.[2]?.firstChild?.innerText.trim(),
    hideButtonOnLargeScreens: row.children?.[3]?.firstChild?.innerText,
  }));

  const buttonGroupContainer = document.createElement("div");
  buttonGroupContainer.classList = "button-group";

  buttons.forEach(button => {
    button.anchorNode.classList = "button";
    button.buttonStyle
      ? button.anchorNode.classList.add(`button--${button.buttonStyle}`)
      : button.anchorNode.classList.add(`button--primary`);

    if (button.altText) button.anchorNode.setAttribute("aria-label", button.altText);

    if (button.hideButtonOnLargeScreens) button.anchorNode.classList.add("button--hide-at-medium");

    buttonGroupContainer.append(button.anchorNode);
  });

  block.replaceWith(buttonGroupContainer);
}
