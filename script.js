document.addEventListener('DOMContentLoaded', () => {
    const topicSelection = document.getElementById('topicSelection');
    const lessonView = document.getElementById('lessonView');
    const backToTopicsBtn = document.getElementById('backToTopics');
    const lessonTitle = document.getElementById('lessonTitle');
    const lessonContent = document.getElementById('lessonContent');
    const quizArea = document.getElementById('quizArea');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const completedTopicsList = document.getElementById('completedTopicsList');

    // --- DATA ---
    const topicsData = [
        {
            id: 'multiplication',
            title: 'Maths: 3 Times Table Fun!',
            icon: 'images/calculator.svg', // You'll need to find/create these images
            learningMaterial: `
                <p>The <strong>3 times table</strong> is super useful! It's like counting in threes.</p>
                <ul>
                    <li>1 x 3 = 3</li>
                    <li>2 x 3 = 6</li>
                    <li>3 x 3 = 9</li>
                    <li>4 x 3 = 12</li>
                    <li>5 x 3 = 15</li>
                    <li>6 x 3 = 18</li>
                    <li>7 x 3 = 21</li>
                    <li>8 x 3 = 24</li>
                    <li>9 x 3 = 27</li>
                    <li>10 x 3 = 30</li>
                </ul>
                <p>Can you see the pattern? Each number is 3 more than the one before!</p>
            `,
            quiz: [
                {
                    question: "What is 3 x 4?",
                    options: ["9", "12", "15", "6"],
                    answer: "12"
                },
                {
                    question: "What is 7 x 3?",
                    options: ["18", "21", "24", "14"],
                    answer: "21"
                }
            ],
            completed: false
        },
        {
            id: 'nouns_verbs',
            title: 'English: Nouns & Verbs!',
            icon: 'images/book.svg',
            learningMaterial: `
                <p>Let's learn about two important types of words: <strong>Nouns</strong> and <strong>Verbs</strong>!</p>
                <p><strong>Nouns</strong> are naming words. They name a:</p>
                <ul>
                    <li>Person (e.g., teacher, Sam, mum)</li>
                    <li>Place (e.g., school, park, London)</li>
                    <li>Thing (e.g., book, car, apple)</li>
                    <li>Idea (e.g., happiness, dream)</li>
                </ul>
                <p><strong>Verbs</strong> are doing or being words. They show an action or a state of being.</p>
                <ul>
                    <li>Action verbs: run, jump, eat, read</li>
                    <li>Being verbs: is, am, are, was, were</li>
                </ul>
                <p>Example: The <strong>dog</strong> (noun) <strong>barks</strong> (verb) loudly.</p>
            `,
            quiz: [
                {
                    question: "Which word is a NOUN: 'The cat sat on the mat.'?",
                    options: ["sat", "on", "cat", "the"],
                    answer: "cat"
                },
                {
                    question: "Which word is a VERB: 'Birds fly in the sky.'?",
                    options: ["Birds", "fly", "in", "sky"],
                    answer: "fly"
                }
            ],
            completed: false
        },
        {
            id: 'plants',
            title: 'Science: Parts of a Plant!',
            icon: 'images/plant.svg',
            learningMaterial: `
                <p>Plants are amazing living things! They have different parts, and each part has a job.</p>
                <img src="images/plant_diagram.svg" alt="Diagram of a plant" style="max-width: 200px; display: block; margin: 10px auto;">
                <ul>
                    <li><strong>Roots:</strong> Hold the plant in the ground and soak up water and nutrients from the soil.</li>
                    <li><strong>Stem:</strong> Supports the plant and carries water and nutrients to the leaves and flowers.</li>
                    <li><strong>Leaves:</strong> Make food for the plant using sunlight, air, and water (this is called photosynthesis!).</li>
                    <li><strong>Flowers:</strong> Are often colorful and help the plant make seeds to grow new plants.</li>
                </ul>
                <p>Not all plants have flowers, but these are common parts!</p>
            `,
            quiz: [
                {
                    question: "Which part of the plant soaks up water from the soil?",
                    options: ["Leaves", "Stem", "Roots", "Flower"],
                    answer: "Roots"
                },
                {
                    question: "Which part of the plant makes food using sunlight?",
                    options: ["Roots", "Stem", "Flower", "Leaves"],
                    answer: "Leaves"
                }
            ],
            completed: false
        }
    ];

    let currentTopicId = null;
    let progress = loadProgress();

    // --- FUNCTIONS ---

    function saveProgress() {
        const progressToSave = topicsData.map(topic => ({ id: topic.id, completed: topic.completed }));
        localStorage.setItem('year3LearningProgress', JSON.stringify(progressToSave));
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem('year3LearningProgress');
        if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            parsedProgress.forEach(pItem => {
                const topic = topicsData.find(t => t.id === pItem.id);
                if (topic) {
                    topic.completed = pItem.completed;
                }
            });
        }
        return topicsData.filter(t => t.completed).length;
    }

    function updateProgressBar() {
        const completedCount = topicsData.filter(topic => topic.completed).length;
        const totalTopics = topicsData.length;
        const percentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

        progressBar.style.width = `${percentage}%`;
        // progressBar.textContent = `${Math.round(percentage)}%`; // Optional: text inside bar
        progressText.textContent = `${Math.round(percentage)}% Complete (${completedCount}/${totalTopics})`;

        // Update completed topics list
        completedTopicsList.innerHTML = 'Completed: ';
        topicsData.forEach(topic => {
            if (topic.completed) {
                const span = document.createElement('span');
                span.classList.add('completed-topic-item');
                span.innerHTML = `<img src="images/tick.svg" alt="tick"> ${topic.title.split(':')[1].trim().replace('!', '')}`;
                completedTopicsList.appendChild(span);
            }
        });
        if (completedCount === 0) {
             completedTopicsList.innerHTML += ' None yet! Keep learning!';
        }
    }


    function displayTopics() {
        topicSelection.innerHTML = ''; // Clear existing topics
        topicsData.forEach(topic => {
            const card = document.createElement('div');
            card.classList.add('topic-card');
            if (topic.completed) {
                card.classList.add('completed');
            }
            card.dataset.topicId = topic.id;
            card.innerHTML = `
                <img src="${topic.icon || 'images/star_empty.svg'}" alt="${topic.title}" class="topic-icon">
                <h3>${topic.title}</h3>
                ${topic.completed ? '<p><em>Completed! Well done!</em></p>' : '<p>Click to learn!</p>'}
            `;
            card.addEventListener('click', () => showLesson(topic.id));
            topicSelection.appendChild(card);
        });
        updateProgressBar();
    }

    function showLesson(topicId) {
        currentTopicId = topicId;
        const topic = topicsData.find(t => t.id === topicId);
        if (!topic) return;

        lessonTitle.textContent = topic.title;
        lessonContent.innerHTML = topic.learningMaterial;
        
        renderQuiz(topic);

        markCompleteBtn.classList.toggle('hidden', topic.completed);
        markCompleteBtn.onclick = () => completeTopic(topicId); // Re-assign for current topic

        topicSelection.classList.add('hidden');
        lessonView.classList.remove('hidden');
    }

    function renderQuiz(topic) {
        quizArea.innerHTML = '<h3>Quick Quiz!</h3>';
        if (!topic.quiz || topic.quiz.length === 0) {
            quizArea.innerHTML += '<p>No quiz for this topic yet.</p>';
            markCompleteBtn.classList.remove('hidden'); // Show complete button if no quiz
            return;
        }

        let allCorrect = true; // Assume all correct initially for non-interactive quiz display

        topic.quiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');
            questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('quiz-options');
            
            q.options.forEach(option => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `quiz-${topic.id}-${index}`;
                input.value = option;
                input.addEventListener('change', (event) => checkAnswer(event, topic.id, index, option, feedbackDiv));
                label.appendChild(input);
                label.appendChild(document.createTextNode(option));
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('feedback');
            feedbackDiv.style.display = 'none'; // Hide initially
            questionDiv.appendChild(feedbackDiv);

            quizArea.appendChild(questionDiv);
        });

        // If we want to auto-show complete button after quiz, more logic is needed here
        // For now, manual "Mark Complete" is simpler
        if(topic.completed) {
             markCompleteBtn.classList.add('hidden');
        } else {
             markCompleteBtn.classList.add('hidden'); // Hide it initially, show after quiz success
        }

    }

    function checkAnswer(event, topicId, questionIndex, selectedAnswer, feedbackDiv) {
        const topic = topicsData.find(t => t.id === topicId);
        const question = topic.quiz[questionIndex];
        
        feedbackDiv.style.display = 'block';
        if (selectedAnswer === question.answer) {
            feedbackDiv.textContent = "Correct! Well done! 🎉";
            feedbackDiv.className = 'feedback correct';
            event.target.parentElement.style.backgroundColor = '#c8e6c9'; // Highlight correct label
        } else {
            feedbackDiv.textContent = `Not quite! The correct answer was: ${question.answer}. Keep trying! 🤔`;
            feedbackDiv.className = 'feedback incorrect';
            event.target.parentElement.style.backgroundColor = '#ffcdd2'; // Highlight incorrect label
        }

        // Disable options for this question after an answer
        const radioButtons = event.target.closest('.quiz-question').querySelectorAll('input[type="radio"]');
        radioButtons.forEach(rb => rb.disabled = true);

        // Check if all quizzes are answered and correct
        checkAllQuizzesAttempted(topicId);
    }
    
    function checkAllQuizzesAttempted(topicId) {
        const topic = topicsData.find(t => t.id === topicId);
        const quizQuestions = quizArea.querySelectorAll('.quiz-question');
        let allAttemptedAndCorrect = true;

        if (quizQuestions.length === 0) { // No quiz for this topic
            if(!topic.completed) markCompleteBtn.classList.remove('hidden');
            return;
        }

        quizQuestions.forEach((qDiv, index) => {
            const feedback = qDiv.querySelector('.feedback');
            if (!feedback || !feedback.classList.contains('correct')) {
                allAttemptedAndCorrect = false;
            }
        });

        if (allAttemptedAndCorrect && !topic.completed) {
            markCompleteBtn.classList.remove('hidden');
            markCompleteBtn.textContent = "Great Job! Mark as Complete";
        } else if (!topic.completed) {
            markCompleteBtn.classList.add('hidden');
        }
    }


    function completeTopic(topicId) {
        const topic = topicsData.find(t => t.id === topicId);
        if (topic && !topic.completed) {
            topic.completed = true;
            progress++;
            saveProgress();
            updateProgressBar();
            markCompleteBtn.classList.add('hidden');
            // Optionally, add a "Completed!" message to the lesson view
            const completedMsg = document.createElement('p');
            completedMsg.innerHTML = "<strong>🌟 You've completed this topic! Awesome! 🌟</strong>";
            completedMsg.style.textAlign = "center";
            completedMsg.style.color = "green";
            completedMsg.style.fontSize = "1.2em";
            quizArea.appendChild(completedMsg); // Or lessonContent
        }
        // Refresh topic cards to show completed status if user goes back
        displayTopics();
    }

    backToTopicsBtn.addEventListener('click', () => {
        lessonView.classList.add('hidden');
        topicSelection.classList.remove('hidden');
        currentTopicId = null;
        displayTopics(); // Refresh to show completion status on cards
    });

    // --- INITIALIZATION ---
    displayTopics();
    loadProgress(); // Load progress and apply it
    updateProgressBar(); // Initial render of progress bar
});