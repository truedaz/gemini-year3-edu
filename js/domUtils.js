// js/domUtils.js
import { countLessonsInItem, isHierarchicalItemFullyCompleted } from './navigationUtils.js'; // We'll create this

export function createItemCard(item, navigateToItemCallback) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.dataset.itemId = item.id;

    let itemProgressHTML = '';
    const itemCounts = countLessonsInItem(item); // Assumes countLessonsInItem is available
    const itemPercentage = itemCounts.total > 0 ? (itemCounts.completed / itemCounts.total) * 100 : 0;
    const fullyCompleted = isHierarchicalItemFullyCompleted(item); // Assumes this is available

    if (item.type === 'year_group') card.classList.add('year-group-card');
    else if (item.type === 'subject' || item.type === 'category') card.classList.add('category-card');

    if (item.type !== 'lesson' && itemCounts.total > 0) {
        itemProgressHTML = `
            <div class="item-progress-bar-container">
                <div class="item-progress-bar" style="width: ${itemPercentage}%;"></div>
            </div>
            <p class="item-progress-text">${Math.round(itemPercentage)}% (${itemCounts.completed}/${itemCounts.total})</p>
        `;
        if (fullyCompleted) card.classList.add('completed-category');
    } else if (item.type === 'lesson' && item.completed) {
        card.classList.add('completed-item');
    }
    
    // Icon logic: Use item.icon if provided, otherwise fallback or subject-specific logic
    let iconSrc = item.icon;
    if (item.type === 'year_group' && !item.icon) { // For year groups, if no icon, try to use first subject's icon or a default
        iconSrc = (item.children && item.children.length > 0 && item.children[0].icon) ? item.children[0].icon : 'images/year_icon.svg';
    } else if (!item.icon) {
        iconSrc = 'images/star_empty.svg'; // General fallback
    }


    card.innerHTML = `
        <img src="${iconSrc}" alt="${item.title}" class="item-icon">
        <h3>${item.title}</h3>
        ${itemProgressHTML}
        <p class="completion-status">
            ${item.type === 'lesson' ? (item.completed ? 'Completed! 🎉' : 'Tap to learn!') :
              (itemCounts.total === 0 ? 'Coming Soon!' : (fullyCompleted ? 'All Done! ✨' : 'Explore'))}
        </p>
    `;
    card.addEventListener('click', () => navigateToItemCallback(item.id));
    return card;
}

export function updateBreadcrumbsDOM(breadcrumbsElem, currentPath, findItemByPathCallback, renderViewCallback) {
    breadcrumbsElem.innerHTML = '<a href="#" data-path="">Home (All Years)</a>';
    let pathAccumulator = [];
    currentPath.forEach(segmentId => {
        pathAccumulator.push(segmentId);
        const item = findItemByPathCallback(pathAccumulator);
        if (item && item.title) {
            breadcrumbsElem.innerHTML += `<span>&gt;</span><a href="#" data-path="${pathAccumulator.join(',')}">${item.title}</a>`;
        }
    });
    breadcrumbsElem.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const pathStr = e.target.dataset.path;
            const newPath = pathStr ? pathStr.split(',') : [];
            renderViewCallback(newPath); // Callback to main.js to update path and re-render
        });
    });
}

export function appendLessonCompletedMessageDOM(container) {
    const existingMsg = container.querySelector('.final-completed-message');
    if(existingMsg) existingMsg.remove();
    const completedMsg = document.createElement('p');
    completedMsg.innerHTML = "<strong>🌟 You've completed this topic! Awesome! 🌟</strong>";
    completedMsg.classList.add("final-completed-message", "feedback", "correct");
    container.appendChild(completedMsg);
}