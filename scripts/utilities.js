

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


export function pronounceWord(word, language) {
    if (!('speechSynthesis' in window)) {
        alert("Sorry, your browser doesn't support text-to-speech. Use Chrome");
        return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(word);

    // Set the language for the utterance
    const languages = {
        'en': 'en-US',  // English
        'es': 'es-ES',  // Spanish
        'ru': 'ru-RU'   // Russian
    };

    utterance.lang = languages[language] || 'en-US'; // Default to English if no valid language is provided

    // Function to handle voice selection and speak the word
    const speakWord = () => {
        const voices = synth.getVoices();
        const matchingVoices = voices.filter(voice => voice.lang.startsWith(languages[language]));

        if (matchingVoices.length > 0) {
            utterance.voice = matchingVoices[0]; // Set the first matching voice for the selected language
        }

        synth.speak(utterance);
    };

    // Handle voice changes or speak directly if voices are already available
    if (synth.getVoices().length > 0) {
        speakWord();
    } else {
        // synth.onvoiceschanged = speakWord;
        console.log('No voices available.');
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
            if (list.classList.contains('pron-en')) {

                e.stopPropagation(); // Prevent flip when pressing the button 
                pronounceWord(entry.word, 'en');
            } else if (list.classList.contains('pron-es')) {
                e.stopPropagation(); // Prevent flip when pressing the button
                pronounceWord(entry.word, 'es');
            } else if (list.classList.contains('pron-ru')) {
                e.stopPropagation(); // Prevent flip when pressing the button
                pronounceWord(entry.word, 'ru');
            }

            else {
                console.log('this pronunciation not available.');

            }
        }

        );
        listItem.appendChild(pronounceButton);
    });




}




