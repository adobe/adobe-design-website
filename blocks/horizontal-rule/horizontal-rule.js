export default async function decorate(block) {
  const horizontalRule = document.createElement('hr');
  horizontalRule.className = 'horizontal-rule';
  
  block.innerHTML = '';
  block.append(horizontalRule);
}
