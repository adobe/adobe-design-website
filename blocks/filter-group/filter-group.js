export default async function decorate(block) {
    const wrapper = block.parentElement;
    wrapper.classList.add('.filter-group-wrapper');

    const label = document.createElement('div');
    label.className = 'filter-group__label util-body-s';
    label.textContent = 'Filter articles:';
    label.id = 'filter-group-label';

    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group__list';
    filterGroup.setAttribute('role', 'group');
    filterGroup.setAttribute('aria-label', 'Filter options');
    filterGroup.setAttribute('aria-describedby', 'filter-group-label');
    filterGroup.id = 'filter-group';

    const filters = [...block.children].map((child) => child.firstElementChild);
    filters.forEach((filter, i) => {
        const button = document.createElement('button');
        button.className = 'filter-group__button util-detail-m';
        button.textContent = filter.textContent;
        button.setAttribute('type', 'button');

        // Set initial selected state
        if (i === 0) {
            button.classList.add('filter-group__button--selected');
        }

        //TODO: Hook up filter button functionality with page
        button.addEventListener('click', () => {
            filterGroup.querySelectorAll('.filter-group__button').forEach((btn) => {
                btn.classList.remove('filter-group__button--selected');
            });
            button.classList.add('filter-group__button--selected');
        });

        filterGroup.append(button);
        filter.remove();
    });

    wrapper.replaceChildren(label, filterGroup);
}
