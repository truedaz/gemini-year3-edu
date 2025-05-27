// js/viewRenderer.js
import { createItemCard, updateBreadcrumbsDOM, appendLessonCompletedMessageDOM } from './domUtils.js';
import { findItemByPath } from './navigationUtils.js'; // Make sure this is correctly pathed if it's not in the same dir
import { renderQuizDOM, checkAllQuizAnswersAndUpdateButton } from './quizManager.js';
import { appData } from './data.js';
import { initFractionExplorer } from './fractionExplorer.js';



// DOM elements (passed from main.js or queried directly if preferred)
let itemViewElem, lessonViewElem, lessonTitleElem, lessonContentElem, quizAreaElem, breadcrumbsElemGlobal;
let navigateToItemCallbackGlobal, renderViewCallbackGlobal; // For breadcrumbs

export function initializeViewRenderer(elements, callbacks) { // <--- ADDED 'export'
    itemViewElem = elements.itemView;
    lessonViewElem = elements.lessonView;
    lessonTitleElem = elements.lessonTitleElem;
    lessonContentElem = elements.lessonContentElem;
    quizAreaElem = elements.quizAreaElem;
    breadcrumbsElemGlobal = elements.breadcrumbsElem;

    navigateToItemCallbackGlobal = callbacks.navigateToItem;
    renderViewCallbackGlobal = callbacks.renderView;
}

export function renderItemView(currentPath) {
    itemViewElem.innerHTML = ''; // Clear previous items
    lessonViewElem.classList.add('hidden');
    itemViewElem.classList.remove('hidden');

    // Update breadcrumbs - assumes updateBreadcrumbsDOM handles its own event listeners or callbacks
    updateBreadcrumbsDOM(breadcrumbsElemGlobal, currentPath, findItemByPath, (newPath) => {
        renderViewCallbackGlobal(newPath); // Call main.js's renderCurrentView
    });

    let itemsToDisplay;
    const currentContextItem = findItemByPath(currentPath); // Get the current category/subject/year

    if (!currentContextItem || !currentContextItem.children) {
        // If path is invalid or points to a leaf node incorrectly, default to showing top-level (appData)
        console.warn("renderItemView: Invalid context or no children for path:", currentPath, "Defaulting to root.");
        itemsToDisplay = appData; // This is the array of year groups
    } else {
        itemsToDisplay = currentContextItem.children; // Children of the current context
    }

    itemsToDisplay.forEach(item => {
        // createItemCard is imported from domUtils.js
        // navigateToItemCallbackGlobal is set during initializeViewRenderer
        const card = createItemCard(item, navigateToItemCallbackGlobal);
        itemViewElem.appendChild(card);
    });
}


export function renderLessonView(lesson) {
    itemViewElem.classList.add('hidden');
    lessonViewElem.classList.remove('hidden');

    lessonTitleElem.textContent = lesson.title;
    lessonContentElem.innerHTML = lesson.learningMaterial; // This has the placeholder div

    // Initialize interactive elements AFTER innerHTML is set
    if (lesson.id === 'y3_fractions') { // Or a more generic way to identify lessons needing custom JS
        initFractionExplorer('interactiveFractionExplorer'); // ID from learningMaterial
    }

    // Static Fraction Image Quiz Area (Example - could be more dynamic)
    if (lesson.id === 'y3_fractions') {
        const imageQuizArea = document.getElementById('fractionImageQuizArea');
        if (imageQuizArea) {
            imageQuizArea.innerHTML = `
                <div class="fraction-image-question">
                    <img src="images/fraction_1_2.svg" alt="One half" style="width:100px; border:1px solid #ccc;">
                    <p>What fraction is shaded? <input type="text" data-answer="1/2" placeholder="e.g. 1/2"></p>
                </div>
                <div class="fraction-image-question">
                    <img src="images/fraction_3_4.svg" alt="Three quarters" style="width:100px; border:1px solid #ccc;">
                    <p>What fraction is shaded? <input type="text" data-answer="3/4" placeholder="e.g. 3/4"></p>
                </div>
                <button id="checkImageFractionsBtn">Check Answers</button>
                <div id="imageFractionFeedback"></div>
            `;
            const checkBtn = document.getElementById('checkImageFractionsBtn');
            if(checkBtn) {
                checkBtn.addEventListener('click', () => {
                    let allCorrect = true;
                    let feedback = "";
                    imageQuizArea.querySelectorAll('.fraction-image-question input').forEach(input => {
                        if (input.value.trim().replace(/\s+/g, '') === input.dataset.answer) {
                            input.style.borderColor = 'green';
                            feedback += `<p>Image for ${input.dataset.answer}: Correct!</p>`;
                        } else {
                            input.style.borderColor = 'red';
                            allCorrect = false;
                            feedback += `<p>Image for ${input.dataset.answer}: Incorrect (Your answer: ${input.value || 'empty'}).</p>`;
                        }
                    });
                    const feedbackDiv = document.getElementById('imageFractionFeedback');
                    if(feedbackDiv) {
                        feedbackDiv.innerHTML = feedback;
                        feedbackDiv.className = allCorrect ? 'feedback correct' : 'feedback incorrect';
                    }
                });
            }
        }
    }


    const markCompleteBtn = document.getElementById('markCompleteBtn');
    if (markCompleteBtn) markCompleteBtn.classList.add('hidden');

    const quizRendered = renderQuizDOM(quizAreaElem, lesson);

    if (lesson.completed) {
        if (markCompleteBtn) markCompleteBtn.classList.add('hidden');
        if (!quizAreaElem.querySelector('.final-completed-message')) {
            appendLessonCompletedMessageDOM(quizAreaElem);
        }
    } else {
        const completedMsg = quizAreaElem.querySelector('.final-completed-message');
        if (completedMsg) completedMsg.remove();
        if (markCompleteBtn) markCompleteBtn.textContent = "Mark as Complete!";

        if (!quizRendered && (!lesson.quiz || lesson.quiz.length === 0)) { // Check if original quiz array is also empty
            if (markCompleteBtn) markCompleteBtn.classList.remove('hidden');
        } else {
             // If quiz was rendered OR there are original quiz questions, rely on checkAllQuizAnswers
            checkAllQuizAnswersAndUpdateButton(quizAreaElem, lesson);
        }
    }
}