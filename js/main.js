// js/main.js
import { appData } from './data.js';
import { loadProgress, saveProgress, getOverallProgressStats, getRecentlyCompletedLessons } from './progress.js';
import { findItemByPath } from './navigationUtils.js';
import { initializeViewRenderer, renderItemView, renderLessonView } from './viewRenderer.js';
import { appendLessonCompletedMessageDOM } from './domUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const domElements = {
        itemView: document.getElementById('itemView'),
        lessonView: document.getElementById('lessonView'),
        backToLessonListBtn: document.getElementById('backToLessonListBtn'),
        lessonTitleElem: document.getElementById('lessonTitle'),
        lessonContentElem: document.getElementById('lessonContent'),
        quizAreaElem: document.getElementById('quizArea'),
        markCompleteBtn: document.getElementById('markCompleteBtn'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.getElementById('progressText'),
        completedTopicsList: document.getElementById('completedTopicsList'),
        breadcrumbsElem: document.getElementById('breadcrumbs'),
        footer: document.querySelector('footer p')
    };

    let currentPath = [];
    let currentLesson = null;

    initializeViewRenderer(
        {
            itemView: domElements.itemView,
            lessonView: domElements.lessonView,
            lessonTitleElem: domElements.lessonTitleElem,
            lessonContentElem: domElements.lessonContentElem,
            quizAreaElem: domElements.quizAreaElem,
            breadcrumbsElem: domElements.breadcrumbsElem
        },
        {
            navigateToItem: navigateToItem,
            renderView: (newPath) => {
                currentPath = newPath;
                renderCurrentView();
            }
        }
    );

    function updateOverallProgressDisplayDOM() {
        const stats = getOverallProgressStats();
        domElements.progressBar.style.width = `${stats.percentage}%`;
        domElements.progressText.textContent = `${stats.percentage}% Complete (${stats.completedCount}/${stats.totalCount} lessons)`;
        domElements.completedTopicsList.innerHTML = 'Recently Completed: ';
        const recent = getRecentlyCompletedLessons();
        if (recent.length === 0) {
            domElements.completedTopicsList.innerHTML += ' None yet!';
        } else {
            recent.forEach(l => {
                const span = document.createElement('span');
                span.classList.add('completed-topic-item');
                span.innerHTML = `<img src="images/tick.svg" alt="tick"> ${l.title}`;
                domElements.completedTopicsList.appendChild(span);
            });
        }
        saveProgress();
    }

    function navigateToItem(itemId) {
        const parentContext = findItemByPath(currentPath);
         if (!parentContext || !parentContext.children) {
             console.error("Navigate: parent context error for path", currentPath);
             currentPath = [];
             renderCurrentView();
             return;
        }
        const item = parentContext.children.find(i => i.id === itemId);

        if (item) {
            currentPath.push(item.id);
            if (item.type === 'lesson') {
                currentLesson = item;
                renderLessonView(item);
            } else {
                currentLesson = null;
                renderItemView(currentPath);
            }
        } else {
             console.error("Navigate: item not found", itemId, "in context", parentContext);
        }
    }

    function renderCurrentView() {
        if (currentLesson && currentPath.includes(currentLesson.id)) {
            renderLessonView(currentLesson);
        } else {
            currentLesson = null;
            renderItemView(currentPath);
        }
    }

    domElements.backToLessonListBtn.addEventListener('click', () => {
        if (currentPath.length > 0) currentPath.pop();
        currentLesson = null;
        renderCurrentView();
    });

    domElements.markCompleteBtn.addEventListener('click', () => {
        if (currentLesson && !currentLesson.completed) {
            currentLesson.completed = true;
            updateOverallProgressDisplayDOM();
            domElements.markCompleteBtn.classList.add('hidden');
            appendLessonCompletedMessageDOM(domElements.quizAreaElem);
        }
    });

    if(domElements.footer) domElements.footer.textContent = `© ${new Date().getFullYear()} Learning App`;

    loadProgress();
    renderCurrentView();
    updateOverallProgressDisplayDOM();
});