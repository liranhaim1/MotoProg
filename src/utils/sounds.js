import correctNotification from '../assets/audio/correct-answer.mp3';
import wrongNotification from '../assets/audio/wrong-answer.mp3';
import buttonSound from '../assets/audio/button-sound.mp3';

export const playSound = (sound) => {
    new Audio(sound).play();
}

export const sounds = {
    correctNotification,
    wrongNotification,
    buttonSound
}