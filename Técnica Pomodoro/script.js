document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const pomodoroBtn = document.getElementById('pomodoroBtn');
    const shortBreakBtn = document.getElementById('shortBreakBtn');
    const longBreakBtn = document.getElementById('longBreakBtn');
    const countDisplay = document.getElementById('count');
    const alarm = document.getElementById('alarm');
    
    // Configuración de tiempos (en segundos)
    const POMODORO_TIME = 25 * 60;
    const SHORT_BREAK_TIME = 5 * 60;
    const LONG_BREAK_TIME = 15 * 60;
    
    // Variables de estado
    let timer;
    let timeLeft = POMODORO_TIME;
    let isRunning = false;
    let currentMode = 'pomodoro';
    let pomodoroCount = 0;
    
    // Formatear tiempo para mostrar (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Actualizar la pantalla del temporizador
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }
    
    // Cambiar modo (Pomodoro, Descanso Corto, Descanso Largo)
    function switchMode(mode) {
        currentMode = mode;
        
        // Actualizar botones activos
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        
        // Detener el temporizador si está corriendo
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = 'Comenzar';
        }
        
        // Establecer el tiempo según el modo
        switch(mode) {
            case 'pomodoro':
                timeLeft = POMODORO_TIME;
                pomodoroBtn.classList.add('active');
                break;
            case 'shortBreak':
                timeLeft = SHORT_BREAK_TIME;
                shortBreakBtn.classList.add('active');
                break;
            case 'longBreak':
                timeLeft = LONG_BREAK_TIME;
                longBreakBtn.classList.add('active');
                break;
        }
        
        updateDisplay();
    }
    
    // Iniciar el temporizador
    function startTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = 'Comenzar';
            return;
        }
        
        isRunning = true;
        startBtn.textContent = 'Pausar';
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                alarm.play();
                
                // Cambiar automáticamente de modo cuando el tiempo termina
                if (currentMode === 'pomodoro') {
                    pomodoroCount++;
                    countDisplay.textContent = pomodoroCount;
                
                    // Cada 4 pomodoros, descanso largo
                    if (pomodoroCount % 4 === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                } else {
                    switchMode('pomodoro');
                }
                
                startBtn.textContent = 'Comenzar';
            }
        }, 1000);
    }
    
    // Reiniciar el temporizador
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Comenzar';
        
        switch(currentMode) {
            case 'pomodoro':
                timeLeft = POMODORO_TIME;
                break;
            case 'shortBreak':
                timeLeft = SHORT_BREAK_TIME;
                break;
            case 'longBreak':
                timeLeft = LONG_BREAK_TIME;
                break;
        }
        
        updateDisplay();
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
    longBreakBtn.addEventListener('click', () => switchMode('longBreak'));
    
    // Inicializar
    updateDisplay();
});