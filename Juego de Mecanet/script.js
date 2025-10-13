 // Variables del juego
let words = ['sol', 'casa', 'mesa', 'gato', 'rojo', 'flor', 'tren', 'css', 'azul', 'pan', 'nube'];
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
    wordInput.className = '';
    wordInput.focus();
}
// Comprobar si la palabra coincide
function checkMatch() {
    const inputValue = wordInput.value;
    
    // Verificar si la palabra está completa y es correcta
    if (inputValue === currentWord) {
        totalChars += currentWord.length;
        correctChars += currentWord.length;
        updateAccuracy();
        
        score++;
        scoreDisplay.textContent = score;
        wordInput.className = 'correct';
        
        // Pequeña pausa para mostrar feedback visual
        setTimeout(() => {
            showWord();
        }, 300);
        return;
    }
    
    // Verificar coincidencia parcial
    if (inputValue.length > 0) {
        // Contar caracteres correctos en la posición actual
        let matchingChars = 0;
        for (let i = 0; i < inputValue.length; i++) {
            if (i < currentWord.length && inputValue[i] === currentWord[i]) {
                matchingChars++;
            }
        }
        
        // Actualizar estadísticas de precisión
        if (inputValue.length > totalChars % currentWord.length) {
            totalChars += inputValue.length - (totalChars % currentWord.length);
            correctChars += matchingChars - (correctChars % currentWord.length);
            updateAccuracy();
        }
        
        // Aplicar estilos visuales
        if (matchingChars === inputValue.length) {
            wordInput.className = '';
        } else {
            wordInput.className = 'incorrect';
        }
        
        // Resaltar caracteres correctos/incorrectos en la palabra mostrada
        highlightWord(inputValue);
    } else {
        wordInput.className = '';
        wordDisplay.innerHTML = currentWord; // Restablecer formato
    }
}
// Resaltar caracteres en la palabra mostrada
function highlightWord(inputValue) {
    let highlightedWord = '';
    for (let i = 0; i < currentWord.length; i++) {
        if (i < inputValue.length) {
            if (inputValue[i] === currentWord[i]) {
                highlightedWord += `<span class="word-correct">${currentWord[i]}</span>`;
            } else {
                highlightedWord += `<span class="word-incorrect">${currentWord[i]}</span>`;
            }
        } else {
            highlightedWord += currentWord[i];
        }
    }
    wordDisplay.innerHTML = highlightedWord;
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
        startBtn.disabled = true;
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
    startBtn.textContent = 'Iniciar';
    startBtn.disabled = false;
    
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    resultsDisplay.textContent = `¡Juego terminado! Puntuación: ${score} | Precisión: ${accuracy}%`;
}
// Inicializar cuando se carga la página
window.addEventListener('load', init);