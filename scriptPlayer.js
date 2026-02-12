document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    // Попытка найти аудио элемент
    let audio = document.getElementById('audioPlayer');
    
    // Если аудио элемент не найден в HTML, создаём его программно
    if (!audio) {
        audio = new Audio();
        audio.id = 'audioPlayer';
        audio.preload = 'auto';
        
        // Добавляем источник — замените 'path/to/your/music.mp3' на реальный путь
        audio.src = 'path/to/your/music.mp3'; // <-- ИЗМЕНИТЕ ЭТУ СТРОКУ!
        
        // Вставляем after player-section
        const playerSection = document.querySelector('.player-section');
        if (playerSection) {
            playerSection.after(audio);
        }
    }
    
    // Форматирование времени (секунды в MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Обновление прогресс-бара
    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }
    
    // Обновление длительности после загрузки метаданных
    function updateDuration() {
        durationEl.textContent = formatTime(audio.duration);
    }
    
    // Обработчики событий
    playBtn.addEventListener('click', function() {
        audio.play().catch(err => {
            console.log('Для воспроизведения укажите корректный путь к аудиофайлу');
            alert('Аудиофайл не найден! Пожалуйста, укажите путь к файлу в HTML или JS.');
        });
    });
    
    pauseBtn.addEventListener('click', function() {
        audio.pause();
    });
    
    stopBtn.addEventListener('click', function() {
        audio.pause();
        audio.currentTime = 0;
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
    
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
    });
    
    // События аудио
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', function() {
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        audio.currentTime = 0;
    });
    
    // Клик по прогресс-бару для перемотки
    const progressContainer = document.querySelector('.progress-container');
    progressContainer.addEventListener('click', function(e) {
        if (audio.duration) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        }
    });
    
    console.log('Плеер инициализирован. Укажите путь к аудиофайлу в переменной audio.src');
});