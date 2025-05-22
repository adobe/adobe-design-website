/**
 * @file TODO: remove this file when ideas page content and functionality is finalized.
 */

/**
 * It's intended for data-tags to be applied to cards of dynamically loaded ideas articles.
 * This mocks up what tags are applied per placeholder card element on the Ideas page.
 */
export const applyTemporaryMockupTags = () => {
    if (window.location.pathname != '/ideas/') return;

    const mockupTagsAppliedToCards = [
        'Design Research,Generative AI Design',
        'Design Systems,Design Process',
        'Design Systems,Design Leadership',
        'Design Strategy',
        'Generative AI Design',
    ];

    document.querySelectorAll('.card')?.forEach((card, i) => {
        if (mockupTagsAppliedToCards.length < i) {
            card.dataset.tags = 'Design Stategy';
            return;
        }
        card.dataset.tags = mockupTagsAppliedToCards[i];
    });
};
