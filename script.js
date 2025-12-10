let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let currentMode = 'focus';

let sessionsCompleted = 0;
const growthStages = ['🌱', '🍃', '🌿', '🌳', '🌲', '🍎', '🏡'];
const sessionsToLevelUp = 2;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

const treeIcon = document.getElementById('tree-icon');
const sessionCount = document.getElementById('session-count');
const progressBar = document.getElementById('progress-fill');
const motivationText = document.getElementById('motivation');

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateDisplay();
    updateGrowthUI();
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Flora Time`;
}

function startTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "Continuar";
        startBtn.classList.remove('active');
    } else {
        isRunning = true;
        startBtn.textContent = "Pausar";
        startBtn.classList.add('active');

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = "Iniciar";
                playAlarm();
                if (currentMode === 'focus') {
                    completeSession();
                } else {
                    alert("¡Descanso terminado! Es hora de volver a enfocarse.");
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Iniciar";
    const activeBtn = document.querySelector('.mode-btn.active');
    timeLeft = parseInt(activeBtn.dataset.time) * 60;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.textContent.toLowerCase().includes('focus') ? 'focus' : 'break';
        timeLeft = parseInt(btn.dataset.time) * 60;
        resetTimer();
    });
});

const soundButtons = document.querySelectorAll('.toggle-sound');
const volumeSliders = document.querySelectorAll('.volume-slider');

soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const soundType = btn.dataset.sound;
        const audio = document.getElementById(`audio-${soundType}`);
        const card = btn.closest('.sound-card');

        if (audio.paused) {
            audio.play();
            btn.textContent = "Pause";
            card.classList.add('playing');
        } else {
            audio.pause();
            btn.textContent = "Play";
            card.classList.remove('playing');
        }
    });
});

volumeSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        const soundType = e.target.dataset.sound;
        const audio = document.getElementById(`audio-${soundType}`);
        audio.volume = e.target.value;
    });
});

function completeSession() {
    sessionsCompleted++;
    saveProgress();
    updateGrowthUI();
    alert("¡Felicidades! Has completado una sesión de enfoque. Tu árbol ha crecido.");
}

function updateGrowthUI() {
    sessionCount.textContent = sessionsCompleted;

    let currentStageIndex = Math.floor(sessionsCompleted / sessionsToLevelUp);
    if (currentStageIndex >= growthStages.length) {
        currentStageIndex = growthStages.length - 1;
    }

    treeIcon.textContent = growthStages[currentStageIndex];
    const sessionsInCurrentLevel = sessionsCompleted % sessionsToLevelUp;
    const percentage = (sessionsInCurrentLevel / sessionsToLevelUp) * 100;
    progressBar.style.width = `${percentage}%`;

    if (sessionsCompleted === 0) motivationText.textContent = "¡Planta tu primera semilla!";
    else if (currentStageIndex === growthStages.length - 1) motivationText.textContent = "¡Tienes un bosque completo!";
    else motivationText.textContent = "Sigue así para crecer más.";
}

function saveProgress() {
    localStorage.setItem('floraTimeSessions', sessionsCompleted);
}

function loadProgress() {
    const saved = localStorage.getItem('floraTimeSessions');
    if (saved) {
        sessionsCompleted = parseInt(saved);
    }
}