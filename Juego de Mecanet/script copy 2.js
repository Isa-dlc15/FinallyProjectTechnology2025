// Variables del juego
let words = ['Computadora','Electricidad','Murciélago','Fotografía','Ferrocarril','Automóvil','Extraordinario','Alimentación','Programación'];
let currentWord = '';
let score = 0;
let time = 60;
let timer;
let isPlaying = false;
let correctChars = 0;
let totalChars = 0;

// Elementos del DOM
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resultsDisplay = document.getElementById('results');
const accuracyDisplay = document.getElementById('accuracy');

// Inicializar el juego
function init() {
    showWord();
    wordInput.addEventListener('input', checkMatch);
    startBtn.addEventListener('click', startGame);
}

// Mostrar una palabra aleatoria
function showWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.textContent = currentWord;
    wordInput.value = '';
    wordInput.focus();
}

// Comprobar si la palabra coincide
function checkMatch() {
    if (wordInput.value === currentWord) {
        totalChars += currentWord.length;
        correctChars += currentWord.length;
        updateAccuracy();
        
        score++;
        scoreDisplay.textContent = score;
        wordInput.value = '';
        showWord();
    } else {
        // Calcular precisión para escritura parcial
        const inputLength = wordInput.value.length;
        const matchingChars = [...wordInput.value].filter((char, i) => char === currentWord[i]).length;
        
        if (inputLength > 0) {
            totalChars += inputLength - (totalChars % currentWord.length);
            correctChars += matchingChars - (correctChars % currentWord.length);
            updateAccuracy();
        }
    }
}

// Actualizar la precisión
function updateAccuracy() {
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    accuracyDisplay.textContent = accuracy;
}

// Iniciar el juego
function startGame() {
    if (!isPlaying) {
        isPlaying = true;
        score = 0;
        time = 60;
        correctChars = 0;
        totalChars = 0;
        
        scoreDisplay.textContent = score;
        timeDisplay.textContent = time;
        accuracyDisplay.textContent = '100';
        
        wordInput.disabled = false;
        wordInput.focus();
        startBtn.textContent = 'Jugando...';
        resultsDisplay.textContent = '';
        
        timer = setInterval(countDown, 1000);
    }
}

// Cuenta regresiva
function countDown() {
    time--;
    timeDisplay.textContent = time;
    
    if (time === 0) {
        clearInterval(timer);
        endGame();
    }
}

// Terminar el juego
function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startBtn.textContent = 'Start';
    
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    resultsDisplay.textContent = `¡Juego terminado! Puntuación: ${score} | Precisión: ${accuracy}%`;
}

// Inicializar cuando se carga la página
window.addEventListener('load', init);