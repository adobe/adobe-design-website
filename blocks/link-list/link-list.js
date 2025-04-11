const buildLinkListAnchor = ({ textContent, url }) => {
  const linkListItem = document.createElement('a');
  linkListItem.className = 'link-list-item';
  linkListItem.href = url;

  const linkListItemContent = document.createElement('div');
  linkListItemContent.className = 'link-list-item__content';
  linkListItem.append(linkListItemContent);

  if (!url.startsWith('https://adobe.design/')) {
    linkListItem.classList.add('link-list-item--external');
  };

  textContent.forEach(textNode => {
    const linkListItemContentPart = document.createElement('span');
    linkListItemContentPart.innerText = textNode.innerText;
    linkListItemContent.append(linkListItemContentPart);
  });

  if (url.startsWith('https://adobe.design/jobs/job-posts/')) {
    linkListItemContent.children[0].className = 'link-list-item__job-title';
    linkListItemContent.children[1].className = 'link-list-item__job-department';
    linkListItemContent.children[2].className = 'link-list-item__job-location';
  };

  return linkListItem;
};

export default async function decorate(block) {
  const linkList = document.createElement('ul');

  const linkListTitle = [...block.children][0].children[0].children[0];
  linkListTitle.className = 'link-list__title';

  let linkListFooterLink = null;
  if ([...block.children][0].children[1].children.length === 1)
    linkListFooterLink = [...block.children][0].children[1].children[0].children[0];

  const linkListLinksData = [...block.children].slice(1).map(row => ({
    textContent: [...row.children[0].children],
    url: row.children[1].innerText,
  }));
  linkListLinksData.forEach(row => {
    const linkListItem = document.createElement('li');
    const linkListAnchor = buildLinkListAnchor(row);

    linkListItem.append(linkListAnchor);
    linkList.append(linkListItem);
  });

  block.innerHTML = '';
  block.append(linkListTitle);
  block.append(linkList);
  if (linkListFooterLink) {
    linkListFooterLink.classList.remove('button');
    block.append(linkListFooterLink);
  };
}
