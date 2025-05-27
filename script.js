document.addEventListener('DOMContentLoaded', () => {
    const itemView = document.getElementById('itemView');
    const lessonView = document.getElementById('lessonView');
    const backToItemsBtn = document.getElementById('backToItemsBtn');
    const lessonTitleElem = document.getElementById('lessonTitle'); // Renamed for clarity
    const lessonContentElem = document.getElementById('lessonContent'); // Renamed
    const quizArea = document.getElementById('quizArea');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const completedTopicsList = document.getElementById('completedTopicsList');
    const breadcrumbsElem = document.getElementById('breadcrumbs');

    // --- DATA STRUCTURE (Hierarchical) ---
    // Note: I will provide a snippet of this. The full data would be too long.
    // Each 'lesson' (leaf node) should have: id, title, icon, learningMaterial, quiz, completed (initially false)
    // Each 'category' node should have: id, title, icon, children (array of other categories or lessons)

    const appData = [
        {
            id: 'maths',
            title: 'Mathematics',
            icon: 'images/category_maths.svg',
            children: [
                {
                    id: 'times_tables_category',
                    title: 'Times Tables',
                    icon: 'images/times_table_icon.svg',
                    children: [
                        // Dynamically generate 2-12 times tables here for brevity in declaration
                        // Example for one:
                        // { id: 'tt_2', title: '2 Times Table', icon: 'images/times_table_icon.svg', learningMaterial: '...', quiz: [...], completed: false }
                    ]
                },
                {
                    id: 'fractions',
                    title: 'Fractions (Intro)',
                    icon: 'images/fractions_icon.svg',
                    learningMaterial: `
                        <p>Fractions tell us about parts of a whole.</p>
                        <p><strong>Tenths:</strong> When something is divided into 10 equal parts, each part is one tenth (1/10).</p>
                        <p>Example: If a chocolate bar has 10 squares, 1 square is 1/10 of the bar. 3 squares are 3/10.</p>
                        <p><strong>Unit Fractions:</strong> Have a 1 on top (numerator), like 1/2, 1/4, 1/10.</p>
                        <p><strong>Non-Unit Fractions:</strong> Have a number other than 1 on top, like 2/3, 3/4, 7/10.</p>
                    `,
                    quiz: [
                        { question: "If a pizza is cut into 10 slices, what fraction is 1 slice?", options: ["1/5", "1/10", "10/1", "1/2"], answer: "1/10" },
                        { question: "Which of these is a UNIT fraction?", options: ["3/5", "1/8", "7/10", "2/2"], answer: "1/8" },
                        { question: "What is 3/10 + 4/10?", options: ["7/20", "1/10", "7/10", "12/100"], answer: "7/10" },
                        { question: "Which fraction means 'three quarters'?", options: ["1/4", "3/4", "4/3", "3/10"], answer: "3/4" },
                        { question: "If you eat 2/5 of a cake, how much is left?", options: ["1/5", "3/5", "5/2", "2/5"], answer: "3/5" }
                    ],
                    completed: false
                }
            ]
        },
        {
            id: 'english',
            title: 'English',
            icon: 'images/category_english.svg',
            children: [
                {
                    id: 'nouns_verbs',
                    title: 'Nouns & Verbs',
                    icon: 'images/book.svg', // Use existing or new specific icon
                    learningMaterial: `
                        <p><strong>Nouns</strong> are naming words (person, place, thing, idea). Examples: <strong>cat, London, happiness, teacher</strong>.</p>
                        <p><strong>Verbs</strong> are doing or being words. Examples: <strong>run, eat, is, were</strong>.</p>
                    `,
                    quiz: [
                        { question: "'The <strong>dog</strong> barked.' What is 'dog'?", options: ["Verb", "Adjective", "Noun", "Adverb"], answer: "Noun" },
                        { question: "'She <strong>sings</strong> beautifully.' What is 'sings'?", options: ["Noun", "Verb", "Preposition", "Adjective"], answer: "Verb" },
                        { question: "Which is a noun: 'jump', 'quickly', 'tree', 'happy'?", options: ["jump", "quickly", "tree", "happy"], answer: "tree" },
                        { question: "Which is a verb: 'book', 'red', 'read', 'slowly'?", options: ["book", "red", "read", "slowly"], answer: "read" },
                        { question: "'My <strong>friend</strong> is kind.' 'Friend' is a...", options: ["Verb", "Noun", "Adjective", "Article"], answer: "Noun" }
                    ],
                    completed: false
                },
                {
                    id: 'punctuation',
                    title: 'Basic Punctuation',
                    icon: 'images/punctuation_icon.svg',
                    learningMaterial: `
                        <p>Punctuation helps us understand writing!</p>
                        <ul>
                            <li><strong>Capital Letters:</strong> Start sentences, for names (Sarah), places (London), I.</li>
                            <li><strong>Full Stop (.):</strong> Ends a statement sentence.</li>
                            <li><strong>Question Mark (?):</strong> Ends a question.</li>
                            <li><strong>Exclamation Mark (!):</strong> Shows strong feeling or surprise.</li>
                        </ul>
                    `,
                    quiz: [
                        { question: "What do you put at the end of this sentence: 'What is your name'", options: [".", "!", "?", ","], answer: "?" },
                        { question: "Which word needs a capital letter: 'i went to paris.'?", options: ["i", "went", "to", "paris (both i and paris)"], answer: "paris (both i and paris)" }, // Adjusted for clarity
                        { question: "What ends this: 'Wow, that's amazing'", options: [".", "?", "!", ";"], answer: "!" },
                        { question: "A sentence that tells you something usually ends with a...", options: ["Question Mark", "Full Stop", "Comma", "Exclamation Mark"], answer: "Full Stop" },
                        { question: "True or False: Days of the week (Monday) need capital letters.", options: ["True", "False"], answer: "True" }
                    ],
                    completed: false
                }
            ]
        },
        {
            id: 'science',
            title: 'Science',
            icon: 'images/category_science.svg',
            children: [
                {
                    id: 'plants_parts', // More specific ID
                    title: 'Parts of a Plant',
                    icon: 'images/plant.svg',
                    learningMaterial: `
                        <p>Plants have parts with special jobs:</p>
                        <img src="images/plant_diagram.svg" alt="Diagram of a plant" style="max-width: 150px; display: block; margin: 10px auto; border: 1px solid #ccc; padding: 5px; background: #f9f9f9;">
                        <ul>
                            <li><strong>Roots:</strong> Anchor the plant, absorb water & nutrients.</li>
                            <li><strong>Stem:</strong> Supports, transports water.</li>
                            <li><strong>Leaves:</strong> Make food (photosynthesis).</li>
                            <li><strong>Flowers:</strong> Make seeds.</li>
                        </ul>
                    `,
                    quiz: [
                        { question: "Which part makes food for the plant?", options: ["Roots", "Stem", "Leaves", "Flower"], answer: "Leaves" },
                        { question: "What do roots primarily absorb?", options: ["Sunlight", "Air", "Water and Nutrients", "Pollen"], answer: "Water and Nutrients" },
                        { question: "Which part helps the plant make seeds?", options: ["Stem", "Leaves", "Flower", "Roots"], answer: "Flower" },
                        { question: "The process leaves use to make food is called:", options: ["Respiration", "Pollination", "Germination", "Photosynthesis"], answer: "Photosynthesis" },
                        { question: "What is the main job of the stem?", options: ["Make seeds", "Absorb sunlight", "Support and transport", "Attract insects"], answer: "Support and transport" }
                    ],
                    completed: false
                },
                {
                    id: 'rocks_types',
                    title: 'Rocks and Fossils',
                    icon: 'images/rocks_icon.svg',
                    learningMaterial: `
                        <p>Rocks are all around us! There are different types.</p>
                        <ul>
                            <li><strong>Igneous:</strong> Formed from cooled magma or lava (e.g., granite, basalt).</li>
                            <li><strong>Sedimentary:</strong> Formed from layers of sand, shells, pebbles (e.g., sandstone, limestone). Fossils are often found here!</li>
                            <li><strong>Metamorphic:</strong> Formed when other rocks are changed by heat and pressure (e.g., marble, slate).</li>
                        </ul>
                        <p><strong>Fossils</strong> are the remains or traces of ancient life preserved in rock.</p>
                    `,
                    quiz: [
                        { question: "Which rock type often contains fossils?", options: ["Igneous", "Metamorphic", "Sedimentary", "Crystal"], answer: "Sedimentary" },
                        { question: "Granite is an example of which rock type?", options: ["Sedimentary", "Igneous", "Metamorphic", "Fossilized"], answer: "Igneous" },
                        { question: "How are metamorphic rocks formed?", options: ["From lava", "From sea shells", "By heat and pressure", "By wind erosion"], answer: "By heat and pressure" },
                        { question: "What are fossils?", options: ["Shiny crystals", "Layers of sand", "Man-made stones", "Remains of ancient life"], answer: "Remains of ancient life" },
                        { question: "Limestone is a type of _________ rock.", options: ["Igneous", "Sedimentary", "Metamorphic", "Volcanic"], answer: "Sedimentary" }
                    ],
                    completed: false
                }
            ]
        }
    ];

    // --- TIMES TABLE GENERATION ---
    function generateTimesTableLesson(num) {
        let material = `<p>Let's learn the <strong>${num} times table</strong>!</p><ul>`;
        for (let i = 1; i <= 12; i++) {
            material += `<li>${i} x ${num} = ${i * num}</li>`;
        }
        material += `</ul><p>Practice makes perfect!</p>`;

        let quiz = [];
        let answersPool = [];
        for(let i=1; i<=12; i++) { answersPool.push(i*num); } // Correct answers
        // Add some distractors
        for(let i=1; i<=12; i++) {
            if(num > 1) answersPool.push(i*num + (Math.random() < 0.5 ? 1 : -1)* (Math.ceil(Math.random()*2))); // slightly off
            answersPool.push(i*(num+1)); // next table
            if (num > 2) answersPool.push(i*(num-1)); // prev table
        }
        answersPool = [...new Set(answersPool)].sort(() => 0.5 - Math.random()); // Unique, shuffled

        for (let i = 0; i < 8; i++) { // Generate 8 quiz questions
            let multiplier = Math.ceil(Math.random() * 12);
            let correctAnswer = multiplier * num;
            let options = [correctAnswer.toString()];
            while (options.length < 4) {
                let wrongAnswer = answersPool[Math.floor(Math.random() * answersPool.length)].toString();
                if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer.toString()) {
                    options.push(wrongAnswer);
                }
            }
            quiz.push({
                question: `What is ${multiplier} x ${num}?`,
                options: options.sort(() => 0.5 - Math.random()), // Shuffle options
                answer: correctAnswer.toString()
            });
        }

        return {
            id: `tt_${num}`,
            title: `${num} Times Table`,
            icon: 'images/times_table_icon.svg', // Generic icon for all times tables
            learningMaterial: material,
            quiz: quiz,
            completed: false
        };
    }

    // Find the times tables category and populate it
    const maths = appData.find(s => s.id === 'maths');
    const timesTablesCategory = maths.children.find(c => c.id === 'times_tables_category');
    if (timesTablesCategory) {
        for (let i = 2; i <= 12; i++) {
            timesTablesCategory.children.push(generateTimesTableLesson(i));
        }
    }

    let currentPath = []; // Array of IDs representing the navigation path
    let currentLesson = null; // Stores the current lesson object when viewing a lesson
    let lessonCompletionStatus = {}; // { lessonId: true/false }

    // --- PROGRESS ---
    function loadProgress() {
        const saved = localStorage.getItem('year3LearningProgress');
        if (saved) {
            lessonCompletionStatus = JSON.parse(saved);
            // Apply completion to the appData structure
            function applySavedProgress(items) {
                items.forEach(item => {
                    if (item.children) {
                        applySavedProgress(item.children);
                    } else if (lessonCompletionStatus[item.id] !== undefined) { // It's a lesson
                        item.completed = lessonCompletionStatus[item.id];
                    }
                });
            }
            applySavedProgress(appData);
        }
        updateProgressBarAndList();
    }

    function saveProgress() {
        // Update lessonCompletionStatus from appData before saving
        function updateStatusFromAppData(items) {
             items.forEach(item => {
                if (item.children) {
                    updateStatusFromAppData(item.children);
                } else { // It's a lesson
                    lessonCompletionStatus[item.id] = item.completed;
                }
            });
        }
        updateStatusFromAppData(appData);
        localStorage.setItem('year3LearningProgress', JSON.stringify(lessonCompletionStatus));
    }

    function countAllLessons(items) {
        let count = 0;
        let completedCount = 0;
        items.forEach(item => {
            if (item.children) {
                const childCounts = countAllLessons(item.children);
                count += childCounts.total;
                completedCount += childCounts.completed;
            } else { // It's a lesson
                count++;
                if (item.completed) {
                    completedCount++;
                }
            }
        });
        return { total: count, completed: completedCount };
    }

    function updateProgressBarAndList() {
        const { total, completed } = countAllLessons(appData);
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}% Complete (${completed}/${total} lessons)`;

        completedTopicsList.innerHTML = 'Completed: ';
        let anyCompleted = false;
        function listCompleted(items) {
            items.forEach(item => {
                if (item.children) {
                    listCompleted(item.children);
                } else if (item.completed) {
                    anyCompleted = true;
                    const span = document.createElement('span');
                    span.classList.add('completed-topic-item');
                    // Try to find a more descriptive parent title if possible
                    let parentTitle = "";
                    if (currentPath.length > 0) { // A bit simplistic, might need better parent finding
                        const parent = findItemByPath(currentPath.slice(0, -1));
                        if (parent && parent.title) parentTitle = parent.title.split(" ")[0] + ": ";
                    }
                    span.innerHTML = `<img src="images/tick.svg" alt="tick"> ${item.title.replace('!', '')}`;
                    completedTopicsList.appendChild(span);
                }
            });
        }
        listCompleted(appData);

        if (!anyCompleted) {
            completedTopicsList.innerHTML += ' None yet! Keep learning!';
        }
        saveProgress(); // Save whenever progress is updated
    }

    // --- NAVIGATION & DISPLAY ---
    function findItemByPath(pathArray) {
        let currentLevel = appData;
        let item = null;
        for (const id of pathArray) {
            item = currentLevel.find(i => i.id === id);
            if (item && item.children) {
                currentLevel = item.children;
            } else if (item) { // Found a leaf node (lesson)
                break;
            } else {
                return null; // Path invalid
            }
        }
        return item; // This will be the category object or lesson object
    }
    
    function isCategoryFullyCompleted(category) {
        if (!category.children || category.children.length === 0) return category.completed || false; // A lesson node
        
        for (const child of category.children) {
            if (child.children) { // It's a sub-category
                if (!isCategoryFullyCompleted(child)) return false;
            } else { // It's a lesson
                if (!child.completed) return false;
            }
        }
        return true;
    }


    function renderCurrentView() {
        itemView.innerHTML = '';
        lessonView.classList.add('hidden');
        itemView.classList.remove('hidden');

        updateBreadcrumbs();

        let itemsToDisplay;
        const currentContext = findItemByPath(currentPath);

        if (currentPath.length === 0) {
            itemsToDisplay = appData; // Top-level subjects
        } else if (currentContext && currentContext.children) {
            itemsToDisplay = currentContext.children; // Sub-categories or lessons
        } else {
            // Should not happen if path is correct, or it's a lesson (handled by showLesson)
            console.error("Error in navigation path or trying to display children of a lesson.");
            currentPath = []; // Reset to home
            itemsToDisplay = appData;
        }

        itemsToDisplay.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('item-card');
            if (item.children) { // It's a category
                card.classList.add('category-card');
                 if (isCategoryFullyCompleted(item)) {
                    card.classList.add('completed-category');
                }
            } else { // It's a lesson
                if (item.completed) {
                    card.classList.add('completed-item');
                }
            }

            card.dataset.itemId = item.id;
            card.innerHTML = `
                <img src="${item.icon || 'images/star_empty.svg'}" alt="${item.title}" class="item-icon">
                <h3>${item.title}</h3>
                <p class="completion-status">${item.completed ? 'Completed! 🎉' : (item.children ? (isCategoryFullyCompleted(item) ? 'All Done! ✨' : '') : 'Tap to learn!')}</p>
            `;
            card.addEventListener('click', () => navigateToItem(item.id));
            itemView.appendChild(card);
        });
    }

    function updateBreadcrumbs() {
        breadcrumbsElem.innerHTML = '<a href="#" data-path="">Home</a>';
        let pathAccumulator = [];
        currentPath.forEach(segmentId => {
            pathAccumulator.push(segmentId);
            const item = findItemByPath(pathAccumulator);
            if (item) {
                breadcrumbsElem.innerHTML += `<span>></span><a href="#" data-path="${pathAccumulator.join(',')}">${item.title}</a>`;
            }
        });

        breadcrumbsElem.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const pathStr = e.target.dataset.path;
                currentPath = pathStr ? pathStr.split(',') : [];
                renderCurrentView();
            });
        });
    }

    function navigateToItem(itemId) {
        const parentContext = currentPath.length > 0 ? findItemByPath(currentPath) : { children: appData };
        const item = parentContext.children.find(i => i.id === itemId);

        if (item) {
            currentPath.push(item.id);
            if (item.children) { // It's a category, render its children
                renderCurrentView();
            } else { // It's a lesson
                showLesson(item);
            }
        }
    }

    function showLesson(lesson) {

        currentLesson = lesson;
        itemView.classList.add('hidden');
        lessonView.classList.remove('hidden');
        
        lessonTitleElem.textContent = lesson.title;
        lessonContentElem.innerHTML = lesson.learningMaterial;
        
        // **CRITICAL CHANGE: Initially hide the button unless the lesson is ALREADY complete AND there's no quiz**
        markCompleteBtn.classList.add('hidden'); // Default to hidden
        
        renderQuiz(lesson); // renderQuiz will decide if it should be shown based on quiz state or no quiz
        
        if (lesson.completed) {
            markCompleteBtn.classList.add('hidden'); // Ensure it's hidden if already completed
            const completedMsg = quizArea.querySelector('.final-completed-message');
            if (!completedMsg) {
                appendLessonCompletedMessage(quizArea);
            }
        } else {
            const completedMsg = quizArea.querySelector('.final-completed-message');
            if (completedMsg) completedMsg.remove();
            markCompleteBtn.textContent = "Mark as Complete!"; // Reset button text
            // If there's no quiz, and it's not completed, then we can show the button
            if (!lesson.quiz || lesson.quiz.length === 0) {
                markCompleteBtn.classList.remove('hidden');
            }
        }        
    }
    
    function appendLessonCompletedMessage(container) {
        const existingMsg = container.querySelector('.final-completed-message');
        if(existingMsg) existingMsg.remove();

        const completedMsg = document.createElement('p');
        completedMsg.innerHTML = "<strong>🌟 You've completed this topic! Awesome! 🌟</strong>";
        completedMsg.style.textAlign = "center";
        completedMsg.style.color = "green";
        completedMsg.style.fontSize = "1.2em";
        completedMsg.classList.add("final-completed-message");
        container.appendChild(completedMsg);
    }


    // --- QUIZ LOGIC (Updated) ---
    function renderQuiz(lesson) {
        quizArea.innerHTML = '<h3>Quick Quiz!</h3>';
        if (!lesson.quiz || lesson.quiz.length === 0) {
            quizArea.innerHTML += '<p>No quiz for this topic yet.</p>';
            if (!lesson.completed) markCompleteBtn.classList.remove('hidden');
            return;
        }
        markCompleteBtn.classList.add('hidden'); // Hide until all questions are correct

        lesson.quiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');
            questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('quiz-options');
            
            q.options.forEach(optionText => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `quiz-${lesson.id}-${index}`;
                input.value = optionText;
                input.addEventListener('change', () => checkSingleAnswer(lesson, index, label, feedbackDiv));
                label.appendChild(input);
                label.appendChild(document.createTextNode(optionText));
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('feedback');
            feedbackDiv.style.display = 'none';
            questionDiv.appendChild(feedbackDiv);
            quizArea.appendChild(questionDiv);
        });
    }

    function checkSingleAnswer(lesson, questionIndex, selectedLabel, feedbackDiv) {
        const question = lesson.quiz[questionIndex];
        const selectedValue = selectedLabel.querySelector('input').value;

        // Reset styles for all labels in this question
        const allLabels = selectedLabel.closest('.quiz-options').querySelectorAll('label');
        allLabels.forEach(lbl => {
            lbl.classList.remove('selected-correct', 'selected-incorrect');
            lbl.style.backgroundColor = ''; // Reset hover/default style
        });

        feedbackDiv.style.display = 'block';
        if (selectedValue === question.answer) {
            feedbackDiv.textContent = "Correct! Well done! 🎉";
            feedbackDiv.className = 'feedback correct';
            selectedLabel.classList.add('selected-correct');
        } else {
            feedbackDiv.textContent = `Not quite! The correct answer was: ${question.answer}. Try again or pick another! 🤔`;
            feedbackDiv.className = 'feedback incorrect';
            selectedLabel.classList.add('selected-incorrect');
        }
        checkAllQuizAnswers(lesson);
    }

    function checkAllQuizAnswers(lesson) {
        if (lesson.completed) {
            markCompleteBtn.classList.add('hidden');
            return;
        }

        let allCorrect = true;
        if (!lesson.quiz || lesson.quiz.length === 0) {
             markCompleteBtn.classList.remove('hidden');
             return;
        }

        const questionDivs = quizArea.querySelectorAll('.quiz-question');
        questionDivs.forEach((qDiv, index) => {
            const selectedRadio = qDiv.querySelector('input[type="radio"]:checked');
            if (!selectedRadio || selectedRadio.value !== lesson.quiz[index].answer) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            markCompleteBtn.classList.remove('hidden');
            markCompleteBtn.textContent = "Great Job! Mark as Complete";
        } else {
            markCompleteBtn.classList.add('hidden');
        }
    }
    
    markCompleteBtn.addEventListener('click', () => {
        if (currentLesson && !currentLesson.completed) {
            currentLesson.completed = true;
            lessonCompletionStatus[currentLesson.id] = true;
            updateProgressBarAndList(); // This will also call saveProgress
            markCompleteBtn.classList.add('hidden');
            appendLessonCompletedMessage(quizArea);
        }
    });

    backToItemsBtn.addEventListener('click', () => {
        currentPath.pop(); // Go up one level
        currentLesson = null;
        renderCurrentView();
    });

    // --- INITIALIZATION ---
    loadProgress(); // Load progress from localStorage
    renderCurrentView(); // Display initial view (top-level categories)
});
