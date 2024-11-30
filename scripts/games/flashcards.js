import { pronounceWord } from '../utilities.js';

export function generateFlashcards(flashcards) {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = ''; // Clear existing flashcards

    flashcards.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'flashcard';

        const cardInner = document.createElement('div');
        cardInner.className = 'flashcard-inner';

        // Add event listener to toggle the flip
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });

        const cardFront = document.createElement('div');
        cardFront.className = 'flashcard-front';
        cardFront.textContent = DOMPurify.sanitize(entry.word);

        // Pronounce button on flashcard front
        const pronounceButton = document.createElement('button');
        pronounceButton.textContent = '🔊';
        pronounceButton.className = 'pronounce-btn-flashcards';
        pronounceButton.addEventListener('click', (e) => {
            if (container.classList.contains('pron-en')) {

                e.stopPropagation(); // Prevent flip when pressing the button 
                pronounceWord(entry.word, 'en');
            } else if (container.classList.contains('pron-es')) {
                e.stopPropagation(); // Prevent flip when pressing the button
                pronounceWord(entry.word, 'es');
            } else if (container.classList.contains('pron-ru')) {
                e.stopPropagation(); // Prevent flip when pressing the button
                pronounceWord(entry.word, 'ru');
            }

            else {

                console.log('this pronunciation not available.');


            }
        });
        cardFront.appendChild(pronounceButton);

        const cardBack = document.createElement('div');
        cardBack.className = 'flashcard-back';
        cardBack.textContent = DOMPurify.sanitize(entry.definition);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        container.appendChild(card);
    });
}
