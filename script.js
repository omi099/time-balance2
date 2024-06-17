document.addEventListener("DOMContentLoaded", () => {
    const hoursValue = document.getElementById("hours-value");
    const minutesValue = document.getElementById("minutes-value");
    const secondsValue = document.getElementById("seconds-value");
    const progress = document.getElementById("progress");
    const quoteText = document.getElementById("quote-text");
    const notificationSound = document.getElementById("notification-sound");
    const preloader = document.getElementById("preloader");
    const themeToggle = document.getElementById("theme-toggle");
    const pomodoroMinutes = document.getElementById("pomodoro-minutes");
    const pomodoroSeconds = document.getElementById("pomodoro-seconds");
    const startPomodoroButton = document.getElementById("start-pomodoro");
    const resetPomodoroButton = document.getElementById("reset-pomodoro");

    let pomodoroTimer = null;
    let isPomodoroRunning = false;

    const quotes = [
        "Time is what we want most, but what we use worst.",
        "The future depends on what you do today.",
        "Time is the most valuable thing a man can spend.",
        "An inch of time is an inch of gold.",
        "Lost time is never found again.",
        "Time is the wisest counselor of all.",
        "Don't watch the clock; do what it does. Keep going.",
        "The key is in not spending time, but in investing it."
    ];

    /**
     * Function to update the remaining hours, minutes, and seconds today
     */
    function updateRemainingTime() {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const remainingMilliseconds = endOfDay - now;
        const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        hoursValue.textContent = hours.toString().padStart(2, "0");
        minutesValue.textContent = minutes.toString().padStart(2, "0");
        secondsValue.textContent = seconds.toString().padStart(2, "0");

        const totalSecondsInADay = 24 * 60 * 60;
        const progressPercentage = ((totalSecondsInADay - remainingSeconds) / totalSecondsInADay) * 100;
        progress.style.width = `${progressPercentage}%`;

        requestAnimationFrame(updateRemainingTime);
    }

    /**
     * Function to display a random quote
     */
    function displayRandomQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.textContent = `"${randomQuote}"`;
    }

    /**
     * Toggle between light and dark modes
     */
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
    }

    /**
     * Function to start the Pomodoro timer
     */
    function startPomodoro() {
        if (isPomodoroRunning) return;

        let minutes = parseInt(pomodoroMinutes.textContent);
        let seconds = parseInt(pomodoroSeconds.textContent);

        pomodoroTimer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(pomodoroTimer);
                    isPomodoroRunning = false;
                    notificationSound.play();
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }

            pomodoroMinutes.textContent = minutes.toString().padStart(2, "0");
            pomodoroSeconds.textContent = seconds.toString().padStart(2, "0");
        }, 1000);

        isPomodoroRunning = true;
    }

    /**
     * Function to reset the Pomodoro timer
     */
    function resetPomodoro() {
        clearInterval(pomodoroTimer);
        isPomodoroRunning = false;

        pomodoroMinutes.textContent = "25";
        pomodoroSeconds.textContent = "00";
    }

    // Event Listeners
    window.addEventListener("load", () => {
        preloader.style.display = "none";
    });

    themeToggle.addEventListener("click", toggleDarkMode);
    startPomodoroButton.addEventListener("click", startPomodoro);
    resetPomodoroButton.addEventListener("click", resetPomodoro);

    // Initialize
    updateRemainingTime();
    displayRandomQuote();
});
