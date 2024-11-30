import { updateVocabularyList, getVocabularyFromLocalStorage, clearVocabulary } from './utilities.js';
import { generateFlashcards } from './games/flashcards.js';
import { startQuiz } from './games/quizmode.js';

function getVocabularyFromTextarea() {
    const textareaValue = document.getElementById('batch-input').value.trim();
    const lines = textareaValue.split('\n');
    const newVocabulary = [];

    lines.forEach(line => {
        const [word, definition] = line.split(':').map(item => DOMPurify.sanitize(item.trim()));
        if (word && definition) {
            newVocabulary.push({ word, definition });
        }
    });

    // Merge new vocabulary with existing vocabulary in localStorage
    const existingVocabulary = getVocabularyFromLocalStorage();
    const mergedVocabulary = [...existingVocabulary];

    // Add only non-duplicate entries
    newVocabulary.forEach(newEntry => {
        if (!mergedVocabulary.some(entry => entry.word === newEntry.word)) {
            mergedVocabulary.push(newEntry);
        }
    });

    // Update the vocabulary list and flashcards
    updateVocabularyList(mergedVocabulary);
    generateFlashcards(mergedVocabulary);

    // Save the merged vocabulary to localStorage
    localStorage.setItem('vocabulary', JSON.stringify(mergedVocabulary));

    return mergedVocabulary;
}



(() => {
    function goToFlashcards() {
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('flashcard-page').classList.remove('hidden');

    }


    function goToMain() {
        document.getElementById('main-page').classList.remove('hidden');
        document.getElementById('flashcard-page').classList.add('hidden');
    }

    // Set up event listeners after the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {



        document.getElementById('add-batch-btn').addEventListener('click', () => {
            getVocabularyFromTextarea(); // This will save vocabulary to localStorage and update lists
            document.getElementById('batch-input').value = '';
        });



        document.getElementById('go-to-flashcards-btn').addEventListener('click', goToFlashcards);
        document.getElementById('go-to-main-btn').addEventListener('click', goToMain);
        document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
        document.getElementById('clear-vocabulary-btn').addEventListener('clicke', clearVocabulary);
    });
})();

export { getVocabularyFromTextarea };
