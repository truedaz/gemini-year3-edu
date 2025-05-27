// js/navigationUtils.js
import { appData } from './data.js';

export function findItemByPath(pathArray) {
    let currentLevelItems = appData;
    let item = null;
    if (!pathArray || pathArray.length === 0) return { children: appData, type: 'root', id: 'root' };

    for (const id of pathArray) {
        item = currentLevelItems.find(i => i.id === id);
        if (!item) return null;
        if (item.children) currentLevelItems = item.children;
        else if (pathArray[pathArray.length - 1] !== id) return null;
        else break;
    }
    return item;
}

export function isHierarchicalItemFullyCompleted(item) {
    if (!item.children || item.children.length === 0) return item.completed || false;
    for (const child of item.children) {
        if (!isHierarchicalItemFullyCompleted(child)) return false;
    }
    return true;
}

export function countLessonsInItem(item) {
    let total = 0, completed = 0;
    if (item.type === 'lesson') {
        total = 1;
        if (item.completed) completed = 1;
    } else if (item.children) {
        item.children.forEach(child => {
            const counts = countLessonsInItem(child);
            total += counts.total;
            completed += counts.completed;
        });
    }
    return { total, completed };
}