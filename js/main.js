// ============ PASSWORD CHECK ============
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const loader = document.getElementById('loader');

const CORRECT_PASSWORD = 'vampirliebe';

passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function checkPassword() {
    const entered = passwordInput.value.toLowerCase().trim();
    
    if (entered === CORRECT_PASSWORD) {
        passwordScreen.classList.add('hidden');
        loader.classList.add('visible');
        setTimeout(() => {
            runLoadingSequence();
        }, 500);
    } else {
        passwordError.classList.add('visible');
        passwordInput.value = '';
        setTimeout(() => {
            passwordError.classList.remove('visible');
        }, 2000);
    }
}

// ============ LOADING SEQUENCE ============
const main = document.getElementById('main');
const loaderBar = document.getElementById('loaderBar');
const loaderBarFill = document.getElementById('loaderBarFill');

const loadingSteps = [
    { id: 'line1', delay: 0, duration: 800, text: 'initializing', complete: 'ok' },
    { id: 'line2', delay: 900, duration: 1200, text: 'decrypting audio', complete: 'done' },
    { id: 'line3', delay: 2200, duration: 1000, text: 'loading chapter_01', complete: 'loaded' },
    { id: 'line4', delay: 3300, duration: 800, text: 'establishing connection', complete: 'secure' },
    { id: 'line5', delay: 4200, duration: 600, text: 'ready', complete: '▶' },
];

function runLoadingSequence() {
    loadingSteps.forEach((step, index) => {
        const line = document.getElementById(step.id);
        
        setTimeout(() => {
            line.classList.add('visible', 'processing');
            loaderBar.classList.add('visible');
            const progress = ((index + 0.5) / loadingSteps.length) * 100;
            loaderBarFill.style.width = progress + '%';
        }, step.delay);

        setTimeout(() => {
            line.classList.remove('processing');
            line.querySelector('.status').textContent = ' [' + step.complete + ']';
            line.querySelector('.status').style.color = 'var(--accent)';
            const progress = ((index + 1) / loadingSteps.length) * 100;
            loaderBarFill.style.width = progress + '%';
        }, step.delay + step.duration);
    });

    setTimeout(() => {
        loader.classList.remove('visible');
        loader.classList.add('hidden');
        main.classList.add('visible');
    }, 5200);
}

// ============ WAVEFORM GENERATION ============
function generateWaveform() {
    const container = document.getElementById('waveform');
    const barCount = 50;
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        const height = 20 + Math.sin(i * 0.3) * 15 + Math.random() * 25;
        bar.style.height = height + 'px';
        container.appendChild(bar);
    }
}

// ============ AUDIO PLAYER ============
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const waveBars = () => document.querySelectorAll('.wave-bar');

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.classList.add('playing');
        statusDot.classList.add('active');
        statusText.textContent = 'playing';
    } else {
        audio.pause();
        playBtn.classList.remove('playing');
        statusDot.classList.remove('active');
        statusText.textContent = 'paused';
    }
});

backBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
});

forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);

    const bars = waveBars();
    const activeIndex = Math.floor((audio.currentTime / audio.duration) * bars.length);
    bars.forEach((bar, i) => {
        bar.classList.remove('active', 'passed');
        if (i < activeIndex) bar.classList.add('passed');
        if (i === activeIndex) bar.classList.add('active');
    });
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.volume = Math.max(0, Math.min(1, percent));
    volumeFill.style.width = (percent * 100) + '%';
});

audio.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    statusDot.classList.remove('active');
    statusText.textContent = 'ended';
});

// Demo duration if no audio
setTimeout(() => {
    if (!audio.duration || isNaN(audio.duration)) {
        durationEl.textContent = '24:17';
    }
}, 6000);

// ============ INIT ============
generateWaveform();
audio.volume = 0.7;