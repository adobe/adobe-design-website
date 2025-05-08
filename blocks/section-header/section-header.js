export default async function decorate(block) {
  const sectionHeader = document.createElement('div');

  block.replaceWith(sectionHeader);
}
