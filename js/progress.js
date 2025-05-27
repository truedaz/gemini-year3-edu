// js/progress.js
import { appData } from './data.js'; // To iterate for saving/loading all lessons

let lessonCompletionStatus = {};
const PROGRESS_STORAGE_KEY = 'learningAppProgress_v3'; // New key for modular version

export function loadProgress() {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
        lessonCompletionStatus = JSON.parse(saved);
        applySavedProgressToData(appData); // Apply to the imported appData
    }
    // No direct DOM update here, main.js will call display functions
}

function applySavedProgressToData(items) {
    items.forEach(item => {
        if (item.type === 'lesson') {
            if (lessonCompletionStatus[item.id] !== undefined) {
                item.completed = lessonCompletionStatus[item.id];
                // Also restore quiz answers if saved
                if (item.quiz && lessonCompletionStatus[`${item.id}_quiz`]) {
                    item.quiz.forEach((q,idx) => {
                        const savedQuizState = lessonCompletionStatus[`${item.id}_quiz`][idx];
                        if(savedQuizState){
                            q.userAnswer = savedQuizState.userAnswer; // For radio
                            if(q.type === 'drag_and_drop_match') q.userAnswers = savedQuizState.userAnswers; // For D&D
                        }
                    });
                }
            }
        } else if (item.children) {
            applySavedProgressToData(item.children);
        }
    });
}

export function saveProgress() {
    // Update lessonCompletionStatus from the live appData structure
    function updateStatusFromAppData(items) {
         items.forEach(item => {
            if (item.type === 'lesson') {
                lessonCompletionStatus[item.id] = item.completed;
                if(item.quiz) { // Save quiz answers too
                    lessonCompletionStatus[`${item.id}_quiz`] = item.quiz.map(q => ({
                        userAnswer: q.userAnswer,
                        userAnswers: q.type === 'drag_and_drop_match' ? q.userAnswers : undefined
                    }));
                }
            } else if (item.children) {
                updateStatusFromAppData(item.children);
            }
        });
    }
    updateStatusFromAppData(appData); // Use imported appData
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(lessonCompletionStatus));
}

// This function now returns data, DOM updates are separate
export function getOverallProgressStats() {
    const overallCounts = countLessonsInItemGlobal({ children: appData, type: 'root' }); // Virtual root, use global count
    const percentage = overallCounts.total > 0 ? (overallCounts.completed / overallCounts.total) * 100 : 0;
    return {
        percentage: Math.round(percentage),
        completedCount: overallCounts.completed,
        totalCount: overallCounts.total
    };
}

export function getRecentlyCompletedLessons() {
    const allLessons = [];
    function collectAllLessons(items) {
        items.forEach(item => {
            if (item.type === 'lesson') allLessons.push(item);
            if (item.children) collectAllLessons(item.children);
        });
    }
    collectAllLessons(appData); // Use imported appData
    return allLessons.filter(l => l.completed).slice(-5).reverse(); // Show last 5
}

// Helper function to count lessons, used by getOverallProgressStats
// Needs to be defined or imported if not already. Let's define it here for simplicity in this module.
function countLessonsInItemGlobal(item) {
    let total = 0, completed = 0;
    if (item.type === 'lesson') {
        total = 1;
        if (item.completed) completed = 1;
    } else if (item.children) {
        item.children.forEach(child => {
            const counts = countLessonsInItemGlobal(child);
            total += counts.total;
            completed += counts.completed;
        });
    }
    return { total, completed };
}