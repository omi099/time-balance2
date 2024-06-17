document.addEventListener("DOMContentLoaded", () => {
  const balanceSeconds = document.getElementById("balance-seconds");
  const balanceMinutes = document.getElementById("balance-minutes");
  const balanceHours = document.getElementById("balance-hours");
  const progress = document.getElementById("progress");
  const quoteText = document.getElementById("quote-text");
  const preloader = document.getElementById("preloader");
  const notificationSound = document.getElementById("notification-sound");
  const themeToggle = document.getElementById("theme-toggle");
  const pomodoroMinutes = document.getElementById("pomodoro-minutes");
  const pomodoroSeconds = document.getElementById("pomodoro-seconds");
  const startPomodoroBtn = document.getElementById("start-pomodoro");
  const resetPomodoroBtn = document.getElementById("reset-pomodoro");
  const customHours = document.getElementById("custom-hours");
  const customMinutes = document.getElementById("custom-minutes");
  const customSeconds = document.getElementById("custom-seconds");
  const startCustomTimerBtn = document.getElementById("start-custom-timer");
  const resetCustomTimerBtn = document.getElementById("reset-custom-timer");

  // Timer State
  let customTimerInterval;
  let remainingCustomSeconds = 0;
  let isCustomTimerRunning = false;

  // Pomodoro State
  let isPomodoroRunning = false;
  let pomodoroInterval;

  // Quotes array
  const quotes = [
    "Time is what we want most, but what we use worst.",
    "The future depends on what you do today.",
    "Time is the most valuable thing a man can spend.",
    "An inch of time is an inch of gold.",
    "Lost time is never found again.",
    "Time is the wisest counselor of all.",
    "Don't watch the clock; do what it does. Keep going.",
    "The key is in not spending time, but in investing it.",
    "Time flies over us but leaves its shadow behind.",
    "Success demands singleness of purpose.",
  ];

  // Function to update the remaining seconds
  function updateRemainingSeconds() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const remainingMilliseconds = endOfDay - now;
    const remainingSecondsInDay = Math.floor(remainingMilliseconds / 1000);
    balanceSeconds.textContent = remainingSecondsInDay.toLocaleString();
    balanceMinutes.textContent = (remainingSecondsInDay / 60).toFixed(2);
    balanceHours.textContent = (remainingSecondsInDay / 3600).toFixed(2);

    const totalSecondsInADay = 24 * 3600;
    const progressPercentage = ((totalSecondsInADay - remainingSecondsInDay) / totalSecondsInADay) * 100;
    progress.style.width = `${progressPercentage}%`;

    requestAnimationFrame(updateRemainingSeconds);
  }

  // Display a random quote
  function displayRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${randomQuote}"`;
  }

  // Preloader
  function hidePreloader() {
    preloader.style.display = "none";
  }

  // Theme Toggle
  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDarkMode ? "🌞" : "🌙";
  }

  // Pomodoro Timer Logic
  function startPomodoro() {
    if (isPomodoroRunning) return;
    isPomodoroRunning = true;

    let minutes = parseInt(pomodoroMinutes.textContent, 10);
    let seconds = parseInt(pomodoroSeconds.textContent, 10);

    pomodoroInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(pomodoroInterval);
          isPomodoroRunning = false;
          showNotification("Pomodoro Complete!", "Take a break!");
          playNotificationSound();
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
  }

  function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isPomodoroRunning = false;
    pomodoroMinutes.textContent = "25";
    pomodoroSeconds.textContent = "00";
  }

  // Custom Timer Logic
  function startCustomTimer() {
    if (isCustomTimerRunning) return;
    isCustomTimerRunning = true;

    const hours = parseInt(customHours.value, 10) || 0;
    const minutes = parseInt(customMinutes.value, 10) || 0;
    const seconds = parseInt(customSeconds.value, 10) || 0;

    remainingCustomSeconds = hours * 3600 + minutes * 60 + seconds;

    customTimerInterval = setInterval(() => {
      if (remainingCustomSeconds <= 0) {
        clearInterval(customTimerInterval);
        isCustomTimerRunning = false;
        showNotification("Custom Timer Complete!", "Time's up!");
        playNotificationSound();
        resetCustomInputs();
      } else {
        remainingCustomSeconds--;

        const remainingHours = Math.floor(remainingCustomSeconds / 3600);
        const remainingMinutes = Math.floor((remainingCustomSeconds % 3600) / 60);
        const remainingSeconds = remainingCustomSeconds % 60;

        customHours.value = remainingHours.toString().padStart(2, "0");
        customMinutes.value = remainingMinutes.toString().padStart(2, "0");
        customSeconds.value = remainingSeconds.toString().padStart(2, "0");
      }
    }, 1000);
  }

  function resetCustomInputs() {
    customHours.value = "0";
    customMinutes.value = "0";
    customSeconds.value = "0";
  }

  function resetCustomTimer() {
    clearInterval(customTimerInterval);
    isCustomTimerRunning = false;
    resetCustomInputs();
  }

  // Desktop Notification
  function showNotification(title, message) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission((status) => {
        if (status === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  }

  // Audio Notification
  function playNotificationSound() {
    notificationSound.currentTime = 0;
    notificationSound.play();
  }

  // Initialize
  function init() {
    updateRemainingSeconds();
    displayRandomQuote();
    hidePreloader();
    setInterval(displayRandomQuote, 30000); // Change quote every 30 seconds

    themeToggle.addEventListener("click", toggleTheme);
    startPomodoroBtn.addEventListener("click", startPomodoro);
    resetPomodoroBtn.addEventListener("click", resetPomodoro);

    startCustomTimerBtn.addEventListener("click", startCustomTimer);
    resetCustomTimerBtn.addEventListener("click", resetCustomTimer);
  }

  // Start main initialization
  init();
});

// Interval Timer
const workDurationInput = document.getElementById("work-duration");
const restDurationInput = document.getElementById("rest-duration");
const startIntervalTimerBtn = document.getElementById("start-interval-timer");
let isIntervalTimerRunning = false;
let intervalTimerInterval;
let isWorkPhase = true;

function startIntervalTimer() {
  if (isIntervalTimerRunning) return;
  isIntervalTimerRunning = true;

  let workPhaseSeconds = parseInt(workDurationInput.value, 10) * 60 || 1500; // 25 mins default
  let restPhaseSeconds = parseInt(restDurationInput.value, 10) * 60 || 300; // 5 mins default
  let currentSeconds = workPhaseSeconds;

  intervalTimerInterval = setInterval(() => {
    if (currentSeconds <= 0) {
      if (isWorkPhase) {
        alert("Work phase complete! Take a break.");
        currentSeconds = restPhaseSeconds;
      } else {
        alert("Break finished! Get back to work.");
        currentSeconds = workPhaseSeconds;
      }
      isWorkPhase = !isWorkPhase;
    }

    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;

    startIntervalTimerBtn.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    currentSeconds--;
  }, 1000);
}

function stopIntervalTimer() {
  clearInterval(intervalTimerInterval);
  isIntervalTimerRunning = false;
}

startIntervalTimerBtn.addEventListener("click", startIntervalTimer);

// Task Tracker
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");

function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText === "") return;

  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;
  taskItem.addEventListener("click", toggleTaskComplete);
  taskList.appendChild(taskItem);
  newTaskInput.value = "";
}

function toggleTaskComplete(event) {
  event.target.classList.toggle("completed");
}

addTaskBtn.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addTask();
});

