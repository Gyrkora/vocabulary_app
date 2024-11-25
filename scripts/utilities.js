
function detectLanguage(word) {
    if (/[а-яА-ЯёЁ]/.test(word)) {
        return 'ru-RU'; // Russian
    } 
    else (/[áéíóúñÁÉÍÓÚÑ]/.test(word)) 
        return 'es-ES'; // Spanish
    // } else {
    //     return 'en-US'; // Default to English
    // }
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
        alert("Sorry, your browser doesn't support text-to-speech. Choose Chrome");
    }
}

export function updateList(vocabulary) {
    const list = document.getElementById('vocabulary-list');
    list.innerHTML = ''; // Clear the list

    vocabulary.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.style.position = "relative"; // Optional, to better control placement of children

        // Pronounce button
        const pronounceButton = document.createElement('button');
        pronounceButton.textContent = '🔊';
        pronounceButton.className = 'pronounce-btn-vocab-list';
        pronounceButton.addEventListener('click', () => pronounceWord(entry.word));
        listItem.appendChild(pronounceButton); // Append button first

        // Word text
        const wordText = document.createElement('p');
        wordText.textContent = `${entry.word}: ${entry.definition}`;
        listItem.appendChild(wordText); // Append the text below the button

        list.appendChild(listItem);
    });
}



export function addBatchEntries(vocabulary, batchInput, updateList, updateStoredXML) {
    if (!batchInput) {
        alert('Please enter some entries.');
        return;
    }

    const lines = batchInput.split('\n');

    lines.forEach(line => {
        const [word, definition] = line.split(':').map(item => item.trim());
        if (word && definition && !vocabulary.some(entry => entry.word === word)) {
            vocabulary.push({ word, definition });
        }
    });

    updateList(vocabulary);
    updateStoredXML(vocabulary);
   
}


