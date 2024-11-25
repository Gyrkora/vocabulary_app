import { updateList, addBatchEntries, pronounceWord } from './utilities.js';
import { exportXML, importXML, updateStoredXML } from './xml_functions.js';
import { generateFlashcards } from './games/flashcards.js';
import { startQuiz } from './games/quizmode.js';

let vocabulary = []; // Temporary storage for vocabulary
let flashcards = []; // Storage for flashcards
let storedXML = ''; // Global variable for the XML

function getVocabulary() {
    return vocabulary;
}

function addVocabularyEntry(entry) {
    if (!vocabulary.some(v => v.word === entry.word)) {
        vocabulary.push(entry);
    }
}

function exportVocabularyXML() {
    storedXML = updateStoredXML(vocabulary);
    exportXML(vocabulary, storedXML);
}

function importVocabularyXML() {
    importXML(vocabulary, updateList, (updatedVocabulary) => {
        storedXML = updateStoredXML(updatedVocabulary);
        flashcards = [...vocabulary]; // Update flashcards array with imported vocabulary
    });
}

function generateFlashcardsPage() {
    generateFlashcards(flashcards);
}

export { getVocabulary, addVocabularyEntry, exportVocabularyXML, importVocabularyXML, generateFlashcardsPage, vocabulary }; // Provide controlled access to vocabulary

(() => {
    function goToFlashcards() {
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('flashcard-page').classList.remove('hidden');
        generateFlashcardsPage(); // Generate flashcards when navigating to the flashcards page
    }

    function goToMain() {
        document.getElementById('main-page').classList.remove('hidden');
        document.getElementById('flashcard-page').classList.add('hidden');
    }

    // Set up event listeners after the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('add-batch-btn').addEventListener('click', () => {
            const batchInput = document.getElementById('batch-input').value.trim();
            addBatchEntries(vocabulary, batchInput, updateList, updateStoredXML);
            storedXML = updateStoredXML(vocabulary); // Update stored XML
            flashcards = [...vocabulary]; // Update flashcards array with current vocabulary
            document.getElementById('batch-input').value = '';
        });

        document.getElementById('export-xml').addEventListener('click', exportVocabularyXML);
        document.getElementById('import-xml-btn').addEventListener('click', importVocabularyXML);
        document.getElementById('go-to-flashcards-btn').addEventListener('click', goToFlashcards);
        document.getElementById('go-to-main-btn').addEventListener('click', goToMain);
        document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    });
})();



/* 


window.exportXML = () => exportXML(vocabulary, storedXML);
window.importXML = () => importXML(vocabulary, updateList, updateStoredXML);
window.generateFlashcards = () => generateFlashcards(flashcards);
window.startQuiz = () => startQuiz();

*/