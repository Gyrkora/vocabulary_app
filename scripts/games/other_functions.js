function detectLanguage(word) {
    // Si contiene caracteres cirílicos, lo consideramos ruso
    if (/[а-яА-ЯёЁ]/.test(word)) {
        return 'ru-RU'; // Ruso
    }
    // Si contiene caracteres típicos del español como tildes o ñ, lo consideramos español
    if (/[áéíóúñÁÉÍÓÚÑ]/.test(word)) {
        return 'es-ES'; // Español
    }
    // Si la palabra tiene solo caracteres del alfabeto latino, preferimos el español por defecto
    if (/^[a-zA-Z]+$/.test(word)) {
        return 'es-ES'; // Español como predeterminado
    }
    // Si hay cualquier otro caso, usar inglés como opción secundaria
    return 'en-US'; // Inglés por defecto solo si no es identificable como español o ruso
}




export function pronounceWord(word) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(word);

        // Detect the language of the word
        const detectedLanguage = detectLanguage(word);
        utterance.lang = detectedLanguage;

        // Get the list of available voices and choose one that matches the detected language
        synth.onvoiceschanged = () => {
            const voices = synth.getVoices();
            const matchingVoices = voices.filter(voice => voice.lang === detectedLanguage);

            if (matchingVoices.length > 0) {
                // Prefer a specific voice if available
                utterance.voice = matchingVoices[0]; // Choose the first available voice for the detected language
            }

            // Log for debugging purposes

            // Speak the word
            synth.speak(utterance);
        };

        // Trigger the voice list retrieval and speak the word
        const voices = synth.getVoices(); // Try to get voices directly (if already available)
        if (voices.length > 0) {
            const matchingVoices = voices.filter(voice => voice.lang === detectedLanguage);

            if (matchingVoices.length > 0) {
                utterance.voice = matchingVoices[0]; // Choose the first available voice for the detected language
            }

            synth.speak(utterance);
        }
    } else {
        alert("Sorry, your browser doesn't support text-to-speech. Use Chrome");
    }
}

