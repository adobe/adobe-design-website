export const loadListingPreFooter = async () => {
  const resp = await fetch('/career-listing-prefooter.plain.html');

  if (resp.ok) {
    const prefooterContainer = document.createElement('section');
    prefooterContainer.classList.add('util-listing-prefooter');
    prefooterContainer.innerHTML = await resp.text();

    return prefooterContainer;
  };

  return null;
}
