import { getVocabulary } from './../main.js';

let currentQuestionIndex = 0;
let score = 0;
let shuffledVocabulary = [];


export function startQuiz() {
    const vocabulary = getVocabulary(); // Get a copy of the vocabulary
    if (vocabulary.length < 3) {
        alert("You need at least 3 words in your vocabulary to start the quiz!");
        return;
    }

    // Shuffle the vocabulary and initialize quiz settings
    shuffledVocabulary = vocabulary.sort(() => 0.5 - Math.random()).slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');

    showQuestion();
}

function showQuestion() {
    const question = shuffledVocabulary[currentQuestionIndex];
    const correctAnswer = question.definition;

    // Generate incorrect choices
    let options = getVocabulary()
        .filter(v => v.word !== question.word) // Exclude the correct word
        .sort(() => 0.5 - Math.random()) // Shuffle the remaining entries
        .slice(0, 2) // Pick two random entries for incorrect choices
        .map(v => v.definition); // Get definitions of incorrect choices

    // Add the correct answer and shuffle the options
    options.push(correctAnswer);
    options = options.sort(() => 0.5 - Math.random());

    // Display the question and options in the interface
    document.getElementById('quiz-question').textContent = `What is the definition of "${question.word}"?`;
    const quizOptions = document.getElementById('quiz-options');
    quizOptions.innerHTML = ''; // Clear previous options

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
    const resultMessage = selectedAnswer === correctAnswer ? "Correct!" : `Wrong! The correct answer was: ${correctAnswer}`;
    alert(resultMessage);

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    document.getElementById('quiz-next-btn').classList.remove('hidden');
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
    alert(`Quiz Finished! Your score: ${score}/${shuffledVocabulary.length}`);
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
}
