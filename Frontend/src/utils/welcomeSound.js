/**
 * Welcome Sound - BOLD MALE VOICE with BADI BHADAAM AWAAZ! 🔊💥
 */

export const playWelcomeSound = () => {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
    }

    const speak = () => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create utterance with BOLD message
        const utterance = new SpeechSynthesisUtterance('Welcome... to Code Arena!');

        // BOLD MALE VOICE SETTINGS - Deep and Powerful! 💪
        utterance.rate = 0.75;      // Slow for impact
        utterance.pitch = 0.6;      // LOW pitch = Deep male voice
        utterance.volume = 1;       // MAX volume!

        // Get voices and find deep male voice
        const voices = window.speechSynthesis.getVoices();

        // Priority: Find deep male voices
        const maleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes('david') ||  // Microsoft David - Deep male
            voice.name.toLowerCase().includes('james') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('male')
        ) || voices.find(voice =>
            voice.name.includes('Google UK English Male') ||
            voice.name.includes('Microsoft David')
        ) || voices.find(voice =>
            voice.lang.includes('en') && !voice.name.toLowerCase().includes('female')
        ) || voices[0];

        if (maleVoice) {
            utterance.voice = maleVoice;
            console.log('Using voice:', maleVoice.name);
        }

        // SPEAK WITH POWER! 🔊
        window.speechSynthesis.speak(utterance);
    };

    // Wait for voices to load
    if (window.speechSynthesis.getVoices().length > 0) {
        speak();
    } else {
        window.speechSynthesis.onvoiceschanged = () => speak();
        setTimeout(speak, 200);
    }
};

// Play EPIC welcome with dramatic chime + BOLD voice
export const playWelcomeChime = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            playWelcomeSound();
            return;
        }

        const audioContext = new AudioContext();

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // DRAMATIC POWER CHORD! 🎸
        const playPowerNote = (frequency, startTime, duration) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sawtooth'; // More powerful sound!

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        const now = audioContext.currentTime;

        // EPIC POWER CHORD SEQUENCE! 💥
        playPowerNote(130.81, now, 0.4);         // C3 - Deep bass
        playPowerNote(164.81, now + 0.1, 0.4);   // E3
        playPowerNote(196.00, now + 0.2, 0.5);   // G3
        playPowerNote(261.63, now + 0.35, 0.6);  // C4 - Rising!

        // BOLD VOICE after epic intro
        setTimeout(() => {
            playWelcomeSound();
        }, 700);

    } catch (error) {
        console.log('Audio error:', error);
        playWelcomeSound();
    }
};

// Test function to check available voices
export const listVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:');
    voices.forEach((voice, i) => {
        console.log(`${i}: ${voice.name} (${voice.lang})`);
    });
};
