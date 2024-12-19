import { getVocabularyFromLocalStorage } from "../utilities.js";

let currentQuestionIndex = 0;
let score = 0;
let shuffledVocabulary = [];

export function startQuiz() {
    const vocabulary = getVocabularyFromLocalStorage();
    if (vocabulary.length < 3) {
        showModal("Oops!", "You need at least 3 words in your vocabulary to start the quiz!", false);
        return;
    }

    // Reset all the quiz data to ensure fresh start
    shuffledVocabulary = vocabulary.sort(() => 0.5 - Math.random()).slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;

    // Show quiz page, hide main page
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');

    showQuestion();
}

function showQuestion() {
    const question = shuffledVocabulary[currentQuestionIndex];
    const correctAnswer = DOMPurify.sanitize(question.definition);

    let options = shuffledVocabulary
        .filter(v => v.word !== question.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(v => DOMPurify.sanitize(v.definition));

    options.push(correctAnswer);
    options = options.sort(() => 0.5 - Math.random());

    document.getElementById('quiz-question').textContent = `What is the definition of "${DOMPurify.sanitize(question.word)}"?`;
    const quizOptions = document.getElementById('quiz-options');
    quizOptions.innerHTML = '';

    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'quiz-option-btn';
        button.addEventListener('click', () => handleAnswerSelection(option, correctAnswer));
        quizOptions.appendChild(button);
    });

    document.getElementById('quiz-next-btn').classList.add('hidden');
}

function handleAnswerSelection(selectedAnswer, correctAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;
    const title = isCorrect ? "🎉 Correct!" : "❌ Wrong!";
    const message = isCorrect ? "Good job! Keep it up!" : `The correct answer was: <strong>${correctAnswer}</strong>`;

    if (isCorrect) score++;

    showModal(title, message, true);
}

document.getElementById('quiz-next-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledVocabulary.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

document.getElementById('end-quiz-btn').addEventListener('click', endQuiz);

function endQuiz() {
    // Show the final score in the modal
    showModal("Quiz Finished!", `Your score: ${score}/${shuffledVocabulary.length}`, false);

    // Wait for the user to close the modal before resetting everything
    const modal = document.getElementById('quiz-modal');
    const closeModalButton = document.getElementById('close-modal');
    const nextButton = document.getElementById('modal-next-btn');

    const closeModalListener = () => {
        resetQuiz();
        document.getElementById('quiz-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        closeModalButton.removeEventListener('click', closeModalListener);
        nextButton.removeEventListener('click', closeModalListener);
    };

    closeModalButton.addEventListener('click', closeModalListener);
    nextButton.addEventListener('click', closeModalListener);
}

function resetQuiz() {
    shuffledVocabulary = [];
    score = 0;
    currentQuestionIndex = 0;
}

function showModal(title, message, showNextButton) {
    const modal = document.getElementById('quiz-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const nextButton = document.getElementById('modal-next-btn');
    const closeModal = document.getElementById('close-modal');

    modalTitle.textContent = title;
    modalMessage.innerHTML = message;
    nextButton.style.display = showNextButton ? 'inline-block' : 'none';

    modal.classList.remove('hidden');
    modal.style.display = 'block';

    closeModal.onclick = () => closeModalFunction(modal);
    nextButton.onclick = () => {
        closeModalFunction(modal);
        document.getElementById('quiz-next-btn').click();
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModalFunction(modal);
        }
    };
}

function closeModalFunction(modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
}
