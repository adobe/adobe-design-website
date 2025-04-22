export default async function decorate(block) {
  const horizontalRow = document.createElement('hr');
  horizontalRow.className = 'horizontal-row';
  
  block.innerHTML = '';
  block.append(horizontalRow);
}
