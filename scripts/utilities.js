
function detectLanguage(word) {
    if (/[а-яА-ЯёЁ]/.test(word)) {
        return 'ru-RU'; // Russian
    } 
    else (/[áéíóúñÁÉÍÓÚÑ]/.test(word)) 
        return 'es-ES'; // Spanish
 
}

export function pronounceWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        const detectedLanguage = detectLanguage(word);
        utterance.lang = detectedLanguage; // Set the detected language

        // Optional settings for better pronunciation
        utterance.rate = 1; // Normal speed
        utterance.pitch = 1; // Normal pitch
        utterance.volume = 1; // Full volume

        console.log(`Pronouncing word: "${word}" in language: ${utterance.lang}`);

        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser doesn't support text-to-speech. Use Chrome");
    }
}

// Updates the list of vocabulary items on the main page
function updateVocabularyList(vocabulary) {
    const list = document.getElementById('vocabulary-list'); // se adhiere al "ul"
    list.innerHTML = ''; // Clear the list

    vocabulary.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${DOMPurify.sanitize(entry.word)}: ${DOMPurify.sanitize(entry.definition)}`;
        list.appendChild(listItem);

        // Pronounce button on flashcard front
        const pronounceButton = document.createElement('button');
        pronounceButton.textContent = '🔊';
        pronounceButton.className = 'pronounce-btn-vocabylary-list';
        pronounceButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent flip when pressing the button
            pronounceWord(entry.word);
        });
        listItem.appendChild(pronounceButton);
        });

    

  
}



// Adds batch entries from user input
function addBatchEntries(vocabulary, batchInput, updateList) {
    if (!batchInput) {
        alert('Please enter some entries.');
        return;
    }

    const lines = batchInput.split('\n');
    lines.forEach(line => {
        const [word, definition] = line.split(':').map(item => DOMPurify.sanitize(item.trim()));
        if (word && definition && !vocabulary.some(entry => entry.word === word)) {
            vocabulary.push({ word, definition });
        }
    });

    updateList(vocabulary); // Refresh the vocabulary list
}

export { updateVocabularyList, addBatchEntries };


export function getVocabularyFromLocalStorage() {
    const storedVocabulary = localStorage.getItem('vocabulary');
    if (storedVocabulary) {
        return JSON.parse(storedVocabulary);
    }
    return [];
}

export function clearVocabulary() {
    localStorage.removeItem('vocabulary'); // Removes only the 'vocabulary' item from localStorage
    
    // Optionally, clear the UI components
    document.getElementById('vocabulary-list').innerHTML = '';
    document.getElementById('flashcard-container').innerHTML = '';
}

// Set up event listener to clear the vocabulary
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clear-vocabulary-btn').addEventListener('click', clearVocabulary);
});