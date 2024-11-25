import { updateList, addBatchEntries, pronounceWord } from './utilities.js';
import { exportXML, importXML, updateStoredXML } from './xml_functions.js';
import { generateFlashcards } from './games/flashcards.js';
import { startQuiz } from './games/quizmode.js';



export let vocabulary = []; // Temporary storage for vocabulary
let flashcards = []; // Storage for flashcards
let storedXML = ''; // Global variable for the XML

window.exportXML = () => exportXML(vocabulary, storedXML);
window.importXML = () => importXML(vocabulary, updateList, updateStoredXML);
window.generateFlashcards = () => generateFlashcards(flashcards);
window.startQuiz = () => startQuiz();

// Navigation between pages
function goToFlashcards() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('flashcard-page').classList.remove('hidden');
    generateFlashcards(flashcards); // Generate flashcards when navigating to the flashcards page
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

    document.getElementById('export-xml').addEventListener('click', () => {
        storedXML = updateStoredXML(vocabulary);
        exportXML(vocabulary, storedXML);
    });

    document.getElementById('import-xml-btn').addEventListener('click', () => {
        importXML(vocabulary, updateList, (updatedVocabulary) => {
            storedXML = updateStoredXML(updatedVocabulary);
            flashcards = [...vocabulary]; // Update flashcards array with imported vocabulary

        });
    });

    document.getElementById('go-to-flashcards-btn').addEventListener('click', goToFlashcards);
    document.getElementById('go-to-main-btn').addEventListener('click', goToMain);
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);

});

