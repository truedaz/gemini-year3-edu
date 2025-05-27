// js/quizManager.js

let currentLessonForQuiz = null;
let checkAllCallback = null;

export function initializeQuizManager(lesson, callback) {
    currentLessonForQuiz = lesson;
    checkAllCallback = callback;
}

export function renderQuizDOM(quizArea, lesson) {
    initializeQuizManager(lesson, () => checkAllQuizAnswersAndUpdateButton(quizArea, lesson));

    quizArea.innerHTML = '<h3>Quick Quiz!</h3>';
    if (!lesson.quiz || lesson.quiz.length === 0) {
        quizArea.innerHTML += '<p>No quiz for this topic yet.</p>';
        return false;
    }
    lesson.quiz.forEach((q, index) => {
        if (q.type === 'drag_and_drop_match') {
            renderDragAndDropMatchQuiz(quizArea, q, index);
        } else if (q.type === 'radio') {
            renderRadioButtonQuiz(quizArea, q, index);
        } else {
            console.warn("Unknown quiz type:", q.type);
        }
    });
    return true;
}

function renderRadioButtonQuiz(quizArea, q, index) {
    const lesson = currentLessonForQuiz;
    const questionContainerId = `quiz-${lesson.id}-q${index}`;
    let questionDiv = quizArea.querySelector(`#${questionContainerId}`);
    if(!questionDiv){
        questionDiv = document.createElement('div');
        questionDiv.id = questionContainerId;
        questionDiv.classList.add('quiz-question', 'radio-quiz');
        quizArea.appendChild(questionDiv);
    } else {
        questionDiv.innerHTML = '';
    }
    questionDiv.innerHTML += `<p>${index + 1}. ${q.question}</p>`;

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('quiz-options');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('feedback');
    feedbackDiv.style.display = 'none';

    q.options.forEach(optionText => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `quiz-radio-${lesson.id}-${index}`;
        input.value = optionText;
        if (q.userAnswer === optionText) input.checked = true;
        input.addEventListener('change', () => {
            q.userAnswer = input.value;
            checkSingleRadioAnswer(q, label, feedbackDiv);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(optionText));
        optionsDiv.appendChild(label);
    });
    questionDiv.appendChild(optionsDiv);
    questionDiv.appendChild(feedbackDiv);
    if (q.userAnswer) {
        const selectedLabel = Array.from(optionsDiv.querySelectorAll('label')).find(l => l.querySelector('input').value === q.userAnswer);
        if(selectedLabel) checkSingleRadioAnswer(q, selectedLabel, feedbackDiv);
    }
}

function checkSingleRadioAnswer(questionObject, selectedLabel, feedbackDiv) {
    const selectedValue = questionObject.userAnswer;
    const allLabels = selectedLabel.closest('.quiz-options').querySelectorAll('label');
    allLabels.forEach(lbl => lbl.classList.remove('selected-correct', 'selected-incorrect'));
    feedbackDiv.style.display = 'block';
    if (selectedValue === questionObject.answer) {
        feedbackDiv.textContent = "Correct! Well done! 🎉";
        feedbackDiv.className = 'feedback correct';
        selectedLabel.classList.add('selected-correct');
    } else {
        feedbackDiv.textContent = `Not quite! The correct answer was: ${questionObject.answer}.`;
        feedbackDiv.className = 'feedback incorrect';
        selectedLabel.classList.add('selected-incorrect');
    }
    if(checkAllCallback) checkAllCallback();
}

function renderDragAndDropMatchQuiz(quizArea, q, quizIndex) {
    const lesson = currentLessonForQuiz;
    const dndContainer = document.createElement('div');
    dndContainer.classList.add('quiz-question', 'dnd-match-quiz');
    dndContainer.dataset.quizIndex = quizIndex;
    dndContainer.innerHTML = `<p>${quizIndex + 1}. ${q.question}</p>`;
    const draggablesPool = document.createElement('div');
    draggablesPool.classList.add('dnd-draggables-pool');
    draggablesPool.innerHTML = '<h4>Drag from here:</h4>';
    const dropzonesContainer = document.createElement('div');
    dropzonesContainer.classList.add('dnd-dropzones-wrapper');

    q.userAnswers = q.userAnswers || {};

    const allDraggableElements = {};
    q.items.forEach(item => {
        allDraggableElements[item.id] = createDraggableElement(item, q, quizIndex);
    });

    q.categories.forEach(cat => {
        const dropzone = document.createElement('div');
        dropzone.classList.add('dnd-dropzone');
        dropzone.dataset.categoryId = cat.id;
        dropzone.innerHTML = `<h4>${cat.name}</h4>`;
        dropzone.addEventListener('dragover', e => e.preventDefault());
        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            const draggedElementIdWithPrefix = e.dataTransfer.getData('text/plain');
            const originalItemId = draggedElementIdWithPrefix.split('_').slice(1).join('_');
            const draggedElement = document.getElementById(draggedElementIdWithPrefix);
            if (draggedElement) {
                dropzone.appendChild(draggedElement);
                q.userAnswers[originalItemId] = cat.id;
            }
            if(checkAllCallback) checkAllCallback();
        });
        dropzonesContainer.appendChild(dropzone);
    });

    q.items.forEach(item => {
        const draggableElement = allDraggableElements[item.id];
        if (q.userAnswers[item.id]) {
            const targetDropzone = dropzonesContainer.querySelector(`.dnd-dropzone[data-category-id="${q.userAnswers[item.id]}"]`);
            if (targetDropzone) targetDropzone.appendChild(draggableElement);
            else draggablesPool.appendChild(draggableElement);
        } else {
            draggablesPool.appendChild(draggableElement);
        }
    });

    draggablesPool.addEventListener('dragover', e => e.preventDefault());
    draggablesPool.addEventListener('drop', e => {
        e.preventDefault();
        const draggedElementIdWithPrefix = e.dataTransfer.getData('text/plain');
        const originalItemId = draggedElementIdWithPrefix.split('_').slice(1).join('_');
        const draggedElement = document.getElementById(draggedElementIdWithPrefix);
        if (draggedElement && q.userAnswers[originalItemId]) {
            delete q.userAnswers[originalItemId];
            draggablesPool.appendChild(draggedElement);
        }
        if(checkAllCallback) checkAllCallback();
    });

    dndContainer.appendChild(draggablesPool);
    dndContainer.appendChild(dropzonesContainer);
    const dndFeedback = document.createElement('div');
    dndFeedback.classList.add('feedback', 'dnd-feedback');
    dndFeedback.style.display = 'none';
    dndContainer.appendChild(dndFeedback);
    quizArea.appendChild(dndContainer);
}

function createDraggableElement(item, q, quizIndex) {
    const draggable = document.createElement('div');
    draggable.classList.add('dnd-draggable-item');
    draggable.textContent = item.text;
    draggable.id = `q${quizIndex}_${item.id}`;
    draggable.dataset.itemId = item.id;
    draggable.draggable = true;
    draggable.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', draggable.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => draggable.classList.add('dnd-dragging'), 0);
    });
    draggable.addEventListener('dragend', () => draggable.classList.remove('dnd-dragging'));
    return draggable;
}

export function checkAllQuizAnswersAndUpdateButton(quizArea, lesson) {
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    if (lesson.completed) {
        if(markCompleteBtn) markCompleteBtn.classList.add('hidden');
        return;
    }
    let allQuestionsCorrect = true;
    if (!lesson.quiz || lesson.quiz.length === 0) {
        if (!lesson.completed && markCompleteBtn) markCompleteBtn.classList.remove('hidden');
        return;
    }
    lesson.quiz.forEach((q, index) => {
        let currentQuestionCorrect = true;
        if (q.type === 'drag_and_drop_match') {
            const dndContainer = quizArea.querySelector(`.dnd-match-quiz[data-quiz-index="${index}"]`);
            const dndFeedbackDiv = dndContainer ? dndContainer.querySelector('.dnd-feedback') : null;
            const totalItemsInQuiz = q.items.length;
            const answeredItemsCount = Object.keys(q.userAnswers || {}).length;

            if (answeredItemsCount !== totalItemsInQuiz) {
                currentQuestionCorrect = false;
                if (dndFeedbackDiv) {
                    dndFeedbackDiv.textContent = "Drag all the words to a box.";
                    dndFeedbackDiv.className = 'feedback dnd-feedback';
                    dndFeedbackDiv.style.display = 'block';
                }
            } else {
                for (const item of q.items) {
                    if (!q.userAnswers || q.userAnswers[item.id] !== item.correctCategory) {
                        currentQuestionCorrect = false; break;
                    }
                }
                if (dndFeedbackDiv) {
                    dndFeedbackDiv.textContent = currentQuestionCorrect ? "Correctly matched! 👍" : "Some words are in the wrong box. 🤔";
                    dndFeedbackDiv.className = `feedback dnd-feedback ${currentQuestionCorrect ? 'correct' : 'incorrect'}`;
                    dndFeedbackDiv.style.display = 'block';
                }
            }
        } else if (q.type === 'radio') {
            if (!q.userAnswer || q.userAnswer !== q.answer) currentQuestionCorrect = false;
        }
        if (!currentQuestionCorrect) allQuestionsCorrect = false;
    });
    if (allQuestionsCorrect && !lesson.completed && markCompleteBtn) {
        markCompleteBtn.classList.remove('hidden');
        markCompleteBtn.textContent = "Great Job! Mark as Complete";
    } else if (markCompleteBtn) {
        markCompleteBtn.classList.add('hidden');
    }
}