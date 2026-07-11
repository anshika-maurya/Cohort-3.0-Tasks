/* Niyama Dashboard Behaviour */

document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initThemeToggle();
  initQuoteRefresh();
  initTasksPage();
  initPlannerPage();
  initFocusPage();
  initGoalsPage();
  initSettingsPage();

  continueSessionBtn?.addEventListener("click", () => {
    stopNotification();

    document.getElementById("alarmModal")?.classList.add("hidden");

    if (nextSessionMode) {
      switchMode(nextSessionMode);

      nextSessionMode = null;
    }
  });
});

function hideAllPages() {
  document.getElementById("dashboardPage")?.classList.add("hidden");
  document.getElementById("tasksPage")?.classList.add("hidden");
  document.getElementById("plannerPage")?.classList.add("hidden");
  document.getElementById("focusPage")?.classList.add("hidden");
  document.getElementById("goalsPage")?.classList.add("hidden");
  document.getElementById("settingsPage")?.classList.add("hidden");
}

function setActiveNav(activeId) {
  document.querySelectorAll(".sidebar .nav-item").forEach((item) => {
    item.classList.remove("is-active");
  });
  document.getElementById(activeId)?.classList.add("is-active");
}

/* Live clock */
function initClock() {
  const timeEl = document.getElementById("currentTime");
  const dateEl = document.getElementById("currentDate");

  if (!timeEl || !dateEl) return;

  const update = () => {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };
  update();
  setInterval(update, 1000 * 30);
}

/* Theme toggle */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const icon = toggle.querySelector(".material-symbols-outlined");
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  icon.textContent = isDark ? "dark_mode" : "wb_sunny";
  toggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      icon.textContent = "wb_sunny";
      localStorage.setItem("niyama-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      icon.textContent = "dark_mode";
      localStorage.setItem("niyama-theme", "dark");
    }
  });
}

/* Motivational quote refresh */
const QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  {
    text: "Your mind is for having ideas, not holding them.",
    author: "David Allen",
  },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Efficiency is doing things right; effectiveness is doing the right things.",
    author: "Peter Drucker",
  },
];

function initQuoteRefresh() {
  const btn = document.getElementById("refreshQuote");
  const textEl = document.getElementById("quoteText");
  const authorEl = document.getElementById("quoteAuthor");
  if (!btn || !textEl || !authorEl) return;
  let lastIndex = -1;
  btn.addEventListener("click", () => {
    btn.classList.add("is-spinning");
    textEl.style.opacity = "0";
    authorEl.style.opacity = "0";
    setTimeout(() => {
      let index;
      do {
        index = Math.floor(Math.random() * QUOTES.length);
      } while (index === lastIndex && QUOTES.length > 1);
      lastIndex = index;
      const { text, author } = QUOTES[index];
      textEl.textContent = `"${text}"`;
      authorEl.textContent = `- ${author.toUpperCase()}`;
      textEl.style.opacity = "1";
      authorEl.style.opacity = "1";
      btn.classList.remove("is-spinning");
    }, 400);
  });
}

/* Settings Page */

/* Show / Hide Settings Page */
function initSettingsPage() {
  const dashboard = document.getElementById("dashboardPage");
  const settings = document.getElementById("settingsPage");
  const openBtn = document.getElementById("openSettings");
  const openMobileBtn = document.getElementById("openSettingsMobile");
  const backBtn = document.getElementById("backToDashboard");
  const profileBtn = document.getElementById("openSettingsProfile");
  profileBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showSettings();
  });
  function showSettings() {
    if (!dashboard || !settings) return;
    hideAllPages();
    document.getElementById("settingsPage")?.classList.remove("hidden");
    setActiveNav("openSettings");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function showDashboard() {
    if (!dashboard || !settings) return;
    hideAllPages();
    document.getElementById("dashboardPage")?.classList.remove("hidden");
    setActiveNav("dashboard-active");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  openBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showSettings();
  });
  openMobileBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showSettings();
  });
  backBtn?.addEventListener("click", showDashboard);
  loadProfile();
  initProfilePreview();
  initSaveProfile();
  initResetModal();
}

/* Profile Image Preview */

function initProfilePreview() {
  const input = document.getElementById("profileInput");
  const preview = document.getElementById("profilePreview");
  if (!input || !preview) return;
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function showSaveToast(message = "Saved Successfully") {
  const toast = document.getElementById("saveToast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.remove("show");

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* Save Profile */
function initSaveProfile() {
  const saveBtn = document.getElementById("saveProfile");
  const toast = document.getElementById("saveToast");
  if (!saveBtn || !toast) return;
  let toastTimer = null;
  showSaveToast();
  // function showSaveToast() {
  //   toast.classList.remove("show");
  //   if (toastTimer) {
  //     clearTimeout(toastTimer);
  //   }
  //   requestAnimationFrame(() => {
  //     toast.classList.add("show");
  //   });
  //   toastTimer = window.setTimeout(() => {
  //     toast.classList.remove("show");
  //     toastTimer = null;
  //   }, 2500);
  // }
  saveBtn.addEventListener("click", () => {
    const name = document.getElementById("displayName").value.trim();
    const photo = document.getElementById("profilePreview").src;
    const profile = { name, photo };
    localStorage.setItem("niyamaProfile", JSON.stringify(profile));
    const dashboardUserName = document.getElementById("dashboardUserName");
    if (dashboardUserName) {
      dashboardUserName.textContent = name;
    }
    const avatar = document.getElementById("topbarAvatar");
    if (avatar) {
      avatar.src = photo;
    }
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    setTimeout(() => {
      showSaveToast();
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes";
    }, 600);
  });
}

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("niyamaProfile"));

  const defaultPhoto =
    "https://three.psbdigital.ca/wp-content/uploads/2024/03/6515859.webp?6bfec1&6bfec1";

  const displayName = document.getElementById("displayName");
  const dashboardUserName = document.getElementById("dashboardUserName");
  const profilePreview = document.getElementById("profilePreview");
  const topbarAvatar = document.getElementById("topbarAvatar");

  if (displayName) {
    displayName.value = profile?.name || "";
  }

  if (dashboardUserName) {
    dashboardUserName.textContent = profile?.name || "Guest";
  }

  if (profilePreview) {
    profilePreview.src = profile?.photo || defaultPhoto;
  }

  if (topbarAvatar) {
    topbarAvatar.src = profile?.photo || defaultPhoto;
  }
}

/* Reset Modal */
function resetDashboardData() {
  tasks = [];
  saveTasks();

  plannerEvents = [];
  savePlannerEvents();

  if (plannerNotes) {
    plannerNotes.value = "";
    savePlannerNotes();
  } else {
    localStorage.removeItem("niyamaPlannerNotes");
  }

  goals = [];
  saveGoals();

  completedSessions = 0;
  focusedMinutes = 0;
  remainingSeconds = durations.focus * 60;
  totalSeconds = durations.focus * 60;
  currentMode = "focus";
  isRunning = false;
  saveFocusStats();
  localStorage.removeItem("focusState");
  localStorage.removeItem("focusDurations");

  localStorage.removeItem("niyamaTasks");
  localStorage.removeItem("niyamaPlannerEvents");
  localStorage.removeItem("niyamaPlannerNotes");
  localStorage.removeItem("niyamaDailyGoals");
  localStorage.removeItem("focusSessions");
  localStorage.removeItem("focusMinutes");

  renderTasks();
  updateTaskDashboardCard();
  renderTimeline();
  updatePlannerDashboardCard();
  renderGoals();
  updateGoalProgress();
  updateGoalDashboardCard();
  if (typeof refreshFocusUI === "function") {
    refreshFocusUI();
  }
  if (typeof updateFocusDashboardCard === "function") {
    updateFocusDashboardCard();
  }
}

function initResetModal() {
  const modal = document.getElementById("resetModal");
  const openBtn = document.getElementById("resetData");
  const cancelBtn = document.getElementById("cancelReset");
  const confirmBtn = document.getElementById("confirmReset");
  if (!modal) return;
  function openModal() {
    modal.classList.remove("hidden");
  }
  function closeModal() {
    modal.classList.add("hidden");
  }
  openBtn?.addEventListener("click", openModal);
  cancelBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
  confirmBtn?.addEventListener("click", () => {
    closeModal();
    resetDashboardData();
  });
}

/* Tasks Page */

/* Task Data */
function getTimeAgo(timestamp) {
  if (!timestamp) return "Just now";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
let tasks = JSON.parse(localStorage.getItem("niyamaTasks")) || [];

/* Initialize */
function initTasksPage() {
  const dashboard = document.getElementById("dashboardPage");
  const tasksPage = document.getElementById("tasksPage");
  const openCard = document.getElementById("openTasksCard");
  const openSidebar = document.getElementById("openTasks");
  const openMobile = document.getElementById("openTasksMobile");
  const backBtn = document.getElementById("backFromTasks");
  openCard?.addEventListener("click", showTasks);
  openSidebar?.addEventListener("click", showTasks);
  openMobile?.addEventListener("click", showTasks);
  backBtn?.addEventListener("click", () => {
    tasksPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  function showTasks(e) {
    e.preventDefault();
    hideAllPages();
    document.getElementById("tasksPage")?.classList.remove("hidden");
    setActiveNav("openTasks");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  document.getElementById("addTaskBtn")?.addEventListener("click", addTask);
  document.getElementById("taskInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
  renderTasks();
  updateTaskDashboardCard();
}

/* Add Task */
function addTask() {
  const input = document.getElementById("taskInput");
  const important = document.getElementById("importantTask");
  const title = input.value.trim();
  if (!title) return;
  tasks.unshift({
    id: Date.now(),
    title,
    important: important.checked,
    completed: false,
    createdAt: Date.now(),
  });
  input.value = "";
  important.checked = false;
  saveTasks();
  renderTasks();
  updateTaskDashboardCard();
}
/* Render */
function renderTasks() {
  const list = document.getElementById("tasksList");
  const empty = document.getElementById("emptyTasks");
  const count = document.getElementById("taskCount");
  if (!list) return;
  list.innerHTML = "";
  const active = tasks.filter((task) => !task.completed).length;
  count.textContent = `(${active})`;
  if (tasks.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  tasks.forEach((task) => {
    const article = document.createElement("article");
    article.className = `
      card
      task-item
      ${task.completed ? "completed" : ""}
      ${task.important ? "important" : ""}
    `;
    article.innerHTML = `
      <div class="task-left">
          <button
            class="task-check"
            onclick="toggleComplete(${task.id})">
            ${
              task.completed
                ? '<span class="material-symbols-outlined">check</span>'
                : ""
            }
          </button>
          <div class="task-content">
            <h3>
              ${task.title}
              ${
                task.important && !task.completed
                  ? '<span class="task-badge">URGENT</span>'
                  : ""
              }
            </h3>
            <p>${task.completed ? "Completed" : getTimeAgo(task.createdAt)}</p>
          </div>
      </div>
      <div class="task-actions">
          <button
              class="star ${task.important ? "active" : ""}"
              onclick="toggleImportant(${task.id})">
              <span class="material-symbols-outlined">
                  star
              </span>
          </button>
          <button
              class="delete"
              onclick="deleteTask(${task.id})">
              <span class="material-symbols-outlined">
                  delete
              </span>
          </button>
      </div>
    `;
    list.appendChild(article);
  });
}
/* Complete */
function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
  updateTaskDashboardCard();
}
/* Important */
function toggleImportant(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.important = !task.important;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}
/* Delete */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  updateTaskDashboardCard();
}
/* Local Storage */
function saveTasks() {
  localStorage.setItem("niyamaTasks", JSON.stringify(tasks));
}

/* Dashboard Task Card */
const taskCardStatus = document.getElementById("taskCardStatus");
const taskCardDescription = document.getElementById("taskCardDescription");
const taskCardProgress = document.getElementById("taskCardProgress");
function updateTaskDashboardCard() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  updateTaskStatus(remainingTasks);
  updateTaskDescription(totalTasks, completedTasks, remainingTasks);
  updateTaskProgress(totalTasks, completedTasks);
}
function updateTaskStatus(remaining) {
  taskCardStatus.className = "pill";

  if (tasks.length === 0) {
    taskCardStatus.classList.add("pill--neutral");

    taskCardStatus.textContent = "Ready";

    return;
  }

  if (remaining === 0) {
    taskCardStatus.classList.add("pill--success");

    taskCardStatus.textContent = "Completed";
  } else if (remaining <= 2) {
    taskCardStatus.classList.add("pill--primary");

    taskCardStatus.textContent = "On Track";
  } else if (remaining <= 5) {
    taskCardStatus.classList.add("pill--warning");

    taskCardStatus.textContent = "Busy";
  } else {
    taskCardStatus.classList.add("pill--danger");

    taskCardStatus.textContent = "High Priority";
  }
}
function updateTaskDescription(total, completed, remaining) {
  if (total === 0) {
    taskCardDescription.textContent = "Create your first task.";

    return;
  }

  if (remaining === 0) {
    taskCardDescription.textContent = `Completed all ${total} tasks 🎉`;

    return;
  }

  taskCardDescription.textContent = `${completed} Completed • ${remaining} Remaining`;
}

function updateTaskProgress(total, completed) {
  if (!taskCardProgress) return;

  const segments = taskCardProgress.querySelectorAll(".segmented-bar__seg");

  segments.forEach((segment) => {
    segment.classList.remove("is-filled");
  });

  if (total === 0) return;

  const percentage = completed / total;

  let filled = 0;

  if (percentage > 0) {
    filled = 1;
  }

  if (percentage >= 0.5) {
    filled = 2;
  }

  if (percentage === 1) {
    filled = 3;
  }

  for (let i = 0; i < filled; i++) {
    segments[i].classList.add("is-filled");
  }
}

/* PLANNER PAGE */
/* Dashboard Planner Card */
const plannerCardStatus = document.getElementById("plannerCardStatus");
const plannerCardDescription = document.getElementById(
  "plannerCardDescription",
);
const plannerCardFooter = document.getElementById("plannerCardFooter");
const plannerCardTime = document.getElementById("plannerCardTime");

/* Planner Hours */
const HOURS = [];
for (let i = 0; i < 24; i++) {
  HOURS.push(i);
}

/* Planner Event */
let plannerEvents =
  JSON.parse(localStorage.getItem("niyamaPlannerEvents")) || [];

/* Planner Elements */
let plannerPage;
let dashboardPage;
let timeline;
let plannerModal;
let deletePlannerModal;
let plannerFab;
let addPriorityBtn;
let plannerNotes;

/* Initialize */
function initPlannerPage() {
  plannerPage = document.getElementById("plannerPage");
  dashboardPage = document.getElementById("dashboardPage");
  timeline = document.getElementById("timeline");
  plannerModal = document.getElementById("plannerModal");
  deletePlannerModal = document.getElementById("deletePlannerModal");
  plannerFab = document.getElementById("plannerFab");
  addPriorityBtn = document.getElementById("addPriority");
  plannerNotes = document.getElementById("plannerNotes");
  const openMobile = document.getElementById("openPlannerMobile");
  bindPlannerEvents();
  bindTimelineEvents();
}

/* Planner Events */
function bindPlannerEvents() {
  const openPlannerCard = document.getElementById("openPlannerCard");
  const openPlanner = document.getElementById("openPlanner");
  const openPlannerMobile = document.getElementById("openPlannerMobile");
  const backBtn = document.getElementById("backFromPlanner");
  const closeModal = document.getElementById("closePlannerModal");
  const cancelPlanner = document.getElementById("cancelPlanner");
  openPlannerCard?.addEventListener("click", showPlanner);
  openPlanner?.addEventListener("click", showPlanner);
  openPlannerMobile?.addEventListener("click", showPlanner);
  backBtn?.addEventListener("click", hidePlanner);
  plannerFab?.addEventListener("click", openPlannerModal);
  closeModal?.addEventListener("click", closePlannerModal);
  cancelPlanner?.addEventListener("click", closePlannerModal);
  plannerNotes?.addEventListener("input", savePlannerNotes);
}

/* Show Planner */
function showPlanner(e) {
  e?.preventDefault();
  hideAllPages();
  document.getElementById("plannerPage")?.classList.remove("hidden");
  setActiveNav("openPlanner");
  updatePlannerDate();
  loadPlannerNotes();
  renderTimeline();
  updatePlannerDashboardCard();
  updateNowLine();
  requestAnimationFrame(() => {
    const currentHour = new Date().getHours();
    const row = timeline.querySelector(`[data-hour="${currentHour}"]`);
    row?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
}

/* Hide Planner */
function hidePlanner() {
  plannerPage.classList.add("hidden");
  dashboardPage.classList.remove("hidden");
  closeAllPlannerModals();
}

/* Planner Modal */
function openPlannerModal() {
  editingPlannerId = null;
  clearPlannerForm();
  plannerModal.classList.remove("hidden");
}
function closePlannerModal() {
  plannerModal.classList.add("hidden");
}

/* Planner Date */
function updatePlannerDate() {
  const day = document.getElementById("plannerDay");
  const date = document.getElementById("plannerDate");
  const now = new Date();
  day.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
  });
  date.textContent = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* Planner Notes */
function loadPlannerNotes() {
  plannerNotes.value = localStorage.getItem("niyamaPlannerNotes") || "";
}
function savePlannerNotes() {
  localStorage.setItem("niyamaPlannerNotes", plannerNotes.value);
}

/* Render Timeline */
function renderTimeline() {
  if (!timeline) return;
  const nowLine = document.getElementById("nowLine");
  timeline.innerHTML = "";
  HOURS.forEach(createTimelineRow);
  if (nowLine) {
    timeline.appendChild(nowLine);
  }
  updateNowLine();
}

/* Create Timeline Row */
function createTimelineRow(hour) {
  const event = plannerEvents.find((item) => item.hour === hour);
  if (!event) {
    timeline.appendChild(createEmptyRow(hour));
    return;
  }
  const row = document.createElement("article");
  row.dataset.hour = hour;
  row.className = "timeline-item";
  if (event.status === "active") {
    row.classList.add("active");
  }
  if (event.type === "lunch") {
    row.classList.add("lunch");
  }
  row.innerHTML = `
        <div class="timeline-time">
            <span class="timeline-hour">
                ${formatHour(hour)}
            </span>
        </div>
        <div class="timeline-event">
            <div class="event-left">
                <h3 class="event-title">
                    ${event.title}
                </h3>
                ${
                  event.description
                    ? `<p class="event-description">
                        ${event.description}
                    </p>`
                    : ""
                }
                ${renderFocusButton(event)}
            </div>
            <div class="event-right">
                <div class="event-actions">
                    <button
                        class="icon-btn edit-event"
                        data-id="${event.id}">
                        <span class="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                    <button
                        class="icon-btn delete-event"
                        data-id="${event.id}">
                        <span class="material-symbols-outlined">
                            delete
                        </span>
                    </button>
                </div>
                ${renderBadge(event)}
            </div>
        </div>
    `;
  timeline.appendChild(row);
}

/* Empty Timeline Row */
function createEmptyRow(hour) {
  const row = document.createElement("article");
  row.dataset.hour = hour;
  row.className = "timeline-item empty";
  row.innerHTML = `
        <div class="timeline-time">
            <span class="timeline-hour">
                ${formatHour(hour)}
            </span>
        </div>
        <button
            class="timeline-empty"
            data-hour="${hour}">
            <span class="material-symbols-outlined">
                add_circle
            </span>
            <span>
                Add Task or Note
            </span>
        </button>
    `;
  return row;
}

/* Format Hour */
function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if (h === 0) {
    h = 12;
  }
  return `${h}:00 ${suffix}`;
}

/* Event Badge */
function renderBadge(event) {
  if (event.status === "active") {
    return `
            <span class="event-badge active">
                Active
            </span>
        `;
  }
  return `
        <span class="event-badge scheduled">
            Scheduled
        </span>
    `;
}

/* Focus Button */
function renderFocusButton(event) {
  if (event.status === "active") {
    return `
            <button
                class="btn-focus stop-focus"
                data-id="${event.id}">
                <span class="material-symbols-outlined">
                    stop_circle
                </span>
                <span>
                    Stop Focus
                </span>
            </button>
        `;
  }
  return `
        <button
            class="btn-focus start-focus"
            data-id="${event.id}">
            <span class="material-symbols-outlined">
                play_arrow
            </span>
            <span>
                Start Focus
            </span>
        </button>
    `;
}

/* Timeline Click Events */
function handleTimelineClick(e) {
  const startBtn = e.target.closest(".start-focus");
  const stopBtn = e.target.closest(".stop-focus");
  const editBtn = e.target.closest(".edit-event");
  const deleteBtn = e.target.closest(".delete-event");
  const emptyBtn = e.target.closest(".timeline-empty");
  if (startBtn) {
    startFocus(Number(startBtn.dataset.id));
    return;
  }
  if (stopBtn) {
    stopFocus(Number(stopBtn.dataset.id));
    return;
  }
  if (editBtn) {
    editPlannerEvent(Number(editBtn.dataset.id));
    return;
  }
  if (deleteBtn) {
    openDeleteModal(Number(deleteBtn.dataset.id));
    return;
  }
  if (emptyBtn) {
    openPlannerModal();
    document.getElementById("eventHour").value = emptyBtn.dataset.hour;
  }
}
function savePlannerEvents() {
  localStorage.setItem("niyamaPlannerEvents", JSON.stringify(plannerEvents));
}

/* Start Focus */
function startFocus(id) {
  plannerEvents = plannerEvents.map((event) => ({
    ...event,
    status: event.id === id ? "active" : "scheduled",
  }));
  savePlannerEvents();
  renderTimeline();
  updatePlannerDashboardCard();
}

/* Stop Focus */
function stopFocus(id) {
  plannerEvents = plannerEvents.map((event) => {
    if (event.id === id) {
      event.status = "scheduled";
    }
    return event;
  });
  savePlannerEvents();
  renderTimeline();
  updatePlannerDashboardCard();
}

/* Save Planner Event */
document.getElementById("savePlannerEvent").addEventListener("click", () => {
  if (editingPlannerId) {
    updatePlannerEvent();
  } else {
    savePlannerEvent();
  }
});

/* Edit Planner Event */
let editingPlannerId = null;
function editPlannerEvent(id) {
  const event = plannerEvents.find((item) => item.id === id);
  if (!event) return;
  editingPlannerId = id;
  document.getElementById("plannerModalTitle").textContent = "Edit Event";
  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventDescription").value = event.description;
  document.getElementById("eventHour").value = event.hour;
  document.getElementById("eventStatus").value = event.status;
  plannerModal.classList.remove("hidden");
}

/* Update Planner Event */
function updatePlannerEvent() {
  plannerEvents = plannerEvents.map((event) => {
    if (event.id !== editingPlannerId) {
      return event;
    }
    return {
      ...event,
      title: document.getElementById("eventTitle").value,
      description: document.getElementById("eventDescription").value,
      hour: Number(document.getElementById("eventHour").value),
      status: document.getElementById("eventStatus").value,
    };
  });
  plannerEvents.sort((a, b) => a.hour - b.hour);
  savePlannerEvents();
  renderTimeline();
  updatePlannerDashboardCard();
  clearPlannerForm();
  closeAllPlannerModals();
  editingPlannerId = null;
}

/* Delete Planner Event */
let deletingPlannerId = null;
function openDeleteModal(id) {
  deletingPlannerId = id;
  deletePlannerModal.classList.remove("hidden");
}
document.getElementById("cancelDelete")?.addEventListener("click", () => {
  deletePlannerModal.classList.add("hidden");
});
document.getElementById("confirmDelete")?.addEventListener("click", () => {
  plannerEvents = plannerEvents.filter((event) => {
    return event.id !== deletingPlannerId;
  });
  savePlannerEvents();
  renderTimeline();
  updatePlannerDashboardCard();
  deletePlannerModal.classList.add("hidden");
});
function savePlannerEvent() {
  const savedHour = Number(document.getElementById("eventHour").value);
  if (editingPlannerId) {
    updatePlannerEvent();
    return;
  }
  const title = document.getElementById("eventTitle").value.trim();

  if (!title) {
    showSaveToast("Please enter event title.");
    return;
  }
  plannerEvents.push({
    id: Date.now(),
    hour: savedHour,
    title,
    description: document.getElementById("eventDescription").value,
    status: document.getElementById("eventStatus").value,
  });
  plannerEvents.sort((a, b) => a.hour - b.hour);
  savePlannerEvents();
  renderTimeline();
  updatePlannerDashboardCard();
  requestAnimationFrame(() => {
    const row = timeline.querySelector(`[data-hour="${savedHour}"]`);
    row?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    row?.classList.add("planner-highlight");
  });
  clearPlannerForm();
  closeAllPlannerModals();
}

/* Clear Form */
function clearPlannerForm() {
  document.getElementById("plannerModalTitle").textContent = "Add Event";
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDescription").value = "";
  document.getElementById("eventStatus").value = "scheduled";
  document.getElementById("eventHour").selectedIndex = 0;
}

/* Populate Hours */
function populateHourSelect() {
  const select = document.getElementById("eventHour");
  if (!select) return;
  select.innerHTML = "";
  HOURS.forEach((hour) => {
    const option = document.createElement("option");
    option.value = hour;
    option.textContent = formatHour(hour);
    select.appendChild(option);
  });
}

/* NOW Line */
function updateNowLine() {
  const timeline = document.getElementById("timeline");
  const nowLine = document.getElementById("nowLine");
  if (!timeline || !nowLine) return;
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const row = timeline.querySelector(`[data-hour="${currentHour}"]`);
  if (!row) {
    nowLine.style.display = "none";
    return;
  }
  nowLine.style.display = "block";
  const rowTop = row.offsetTop;
  const rowHeight = row.offsetHeight;
  nowLine.style.top = `${rowTop + rowHeight / 2}px`;
}

/* Planner Startup */
populateHourSelect();

/* Timeline Event Delegation */
function bindTimelineEvents() {
  if (!timeline) return;
  timeline.addEventListener("click", handleTimelineClick);
}

/* Save Notes Before Exit */
window.addEventListener("beforeunload", () => {
  savePlannerNotes();
  savePlannerEvents();
});

/* Planner Refresh */
function refreshPlanner() {
  renderTimeline();
  updateNowLine();
  updatePlannerDashboardCard();
}

/* Utilities */
function getPlannerEvent(id) {
  return plannerEvents.find((event) => event.id === id);
}
function resetPlannerForm() {
  editingPlannerId = null;
  clearPlannerForm();
}
function closeAllPlannerModals() {
  plannerModal.classList.add("hidden");
  deletePlannerModal.classList.add("hidden");
  resetPlannerForm();
}

/* ESC Key */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeAllPlannerModals();
});

/* Modal Outside Click */
plannerModal?.addEventListener("click", (e) => {
  if (e.target === plannerModal) {
    closeAllPlannerModals();
  }
});
deletePlannerModal?.addEventListener("click", (e) => {
  if (e.target === deletePlannerModal) {
    closeAllPlannerModals();
  }
});

/* Planner Init */

/* Dashboard Planner Card */
function updatePlannerDashboardCard() {
  if (!plannerCardStatus || !plannerCardDescription || !plannerCardTime) return;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const activeEvent = plannerEvents.find((event) => event.status === "active");
  if (activeEvent) {
    plannerCardStatus.className = "pill pill--primary";
    plannerCardStatus.textContent = "In Progress";
    plannerCardDescription.textContent = activeEvent.title;
    plannerCardTime.textContent = "Ends this hour";
    return;
  }
  const nextEvent = plannerEvents.find((event) => event.hour >= currentHour);
  if (nextEvent) {
    const minutesRemaining =
      (nextEvent.hour - currentHour) * 60 - currentMinute;
    plannerCardStatus.className = "pill pill--neutral";
    plannerCardStatus.textContent = `Next • ${formatHour(nextEvent.hour)}`;
    plannerCardDescription.textContent = nextEvent.title;
    if (minutesRemaining <= 0) {
      plannerCardTime.textContent = "Starting now";
    } else if (minutesRemaining < 60) {
      plannerCardTime.textContent = `Starts in ${minutesRemaining} mins`;
    } else {
      const hours = Math.floor(minutesRemaining / 60);
      plannerCardTime.textContent = `Starts in ${hours} hr${hours > 1 ? "s" : ""}`;
    }
    return;
  }
  plannerCardStatus.className = "pill pill--success";
  plannerCardStatus.textContent = "Free Day";
  plannerCardDescription.textContent = "No upcoming events";
  plannerCardTime.textContent = "Enjoy your schedule 🌿";
}

/* FOCUS TIMER */
/* Focus Variables */
let focusPage;
let focusTimer;
let timerDisplay;
let timerStatus;
let progressCircle;
let playPauseBtn;
let playPauseIcon;
let resetBtn;
let skipBtn;
let focusTabs;
let currentMode = "focus";
let isRunning = false;
let timer = null;
let focusCardStatus;
let notificationAudio = null;
let nextSessionMode = null;

/* Dashboard Focus Card */
const focusCardIcon = document.getElementById("focusCardIcon");
const focusCardDescription = document.getElementById("focusCardDescription");
const focusCardProgress = document.getElementById("focusCardProgress");

/* Default Durations */
let durations = {
  focus: 25,
  short: 5,
  long: 15,
};
let totalSeconds = durations.focus * 60;
let remainingSeconds = totalSeconds;
let completedSessions = Number(localStorage.getItem("focusSessions")) || 0;
let focusedMinutes = Number(localStorage.getItem("focusMinutes")) || 0;

/* Dashboard Focus Card */
function updateFocusDashboardCard() {
  if (
    !focusCardIcon ||
    !focusCardStatus ||
    !focusCardDescription ||
    !focusCardProgress
  )
    return;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const percentage =
    totalSeconds === 0
      ? 0
      : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  focusCardProgress.style.width = `${percentage}%`;
  if (isRunning) {
    focusCardStatus.className = "pill pill--primary";
    focusCardStatus.textContent = "Running";
    focusCardIcon.textContent = "pause";
    focusCardDescription.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} Remaining`;
  } else if (remainingSeconds === totalSeconds) {
    focusCardStatus.className = "pill pill--neutral";
    focusCardStatus.textContent = "Ready";
    focusCardIcon.textContent = "play_arrow";
    focusCardDescription.textContent = `${durations[currentMode]} Min Session Ready`;
  } else if (remainingSeconds === 0) {
    focusCardStatus.className = "pill pill--success";
    focusCardStatus.textContent = "Completed";
    focusCardIcon.textContent = "check_circle";
    focusCardDescription.textContent = "Session Complete 🎉";
  } else {
    focusCardStatus.className = "pill pill--warning";
    focusCardStatus.textContent = "Paused";
    focusCardIcon.textContent = "play_arrow";
    focusCardDescription.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} Paused`;
  }
}
/* Initialize */
function initFocusPage() {
  focusPage = document.getElementById("focusPage");
  timerDisplay = document.getElementById("timerDisplay");
  timerStatus = document.getElementById("timerStatus");
  progressCircle = document.getElementById("progressCircle");
  progressCircle.style.strokeDasharray = PROGRESS_LENGTH;
  playPauseBtn = document.getElementById("playPauseTimer");
  playPauseIcon = document.getElementById("playPauseIcon");
  resetBtn = document.getElementById("resetTimer");
  skipBtn = document.getElementById("skipTimer");
  focusTabs = document.querySelectorAll(".focus-tab");
  focusCardStatus = document.getElementById("focusCardStatus");
  const openMobile = document.getElementById("openFocusMobile");
  bindFocusEvents();
  restoreFocusData();
  refreshFocusUI();
  updateTimerDisplay();
  updateFocusDashboardCard();
  console.log("Focus Timer Loaded");
}

/* Event Listeners */
function bindFocusEvents() {
  const openFocusCard = document.getElementById("openFocusCard");
  const openFocus = document.getElementById("openFocus");
  const openFocusMobile = document.getElementById("openFocusMobile");
  const backBtn = document.getElementById("backFromFocus");
  openFocusCard?.addEventListener("click", showFocusPage);
  openFocus?.addEventListener("click", showFocusPage);
  openFocusMobile?.addEventListener("click", showFocusPage);
  backBtn?.addEventListener("click", hideFocusPage);
  playPauseBtn?.addEventListener("click", toggleTimer);
  resetBtn?.addEventListener("click", resetTimer);
  skipBtn?.addEventListener("click", skipTimer);
  focusTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchMode(tab.dataset.mode);
    });
  });
  const openSidebar = document.getElementById("openFocus");
  const openMobile = document.getElementById("openFocusMobile");
  openSidebar?.addEventListener("click", showFocusPage);
  openMobile?.addEventListener("click", showFocusPage);
}

/* Open Focus Page */
function showFocusPage(e) {
  e?.preventDefault();
  hideAllPages();
  document.getElementById("focusPage")?.classList.remove("hidden");
  setActiveNav("openFocus");
  updateTimerDisplay();
  updateProgressRing();
  loadFocusStats();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* Back To Dashboard */
function hideFocusPage() {
  focusPage.classList.add("hidden");
  dashboardPage.classList.remove("hidden");
}

/* Load Stats */
function loadFocusStats() {
  document.getElementById("sessionCount").textContent = completedSessions;
  document.getElementById("focusHours").textContent = (
    focusedMinutes / 60
  ).toFixed(1);
}

/* Toggle Timer */
function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

/* Start Timer */
function startTimer() {
  stopNotification();
  if (isRunning) return;
  isRunning = true;
  saveFocusState();
  playPauseIcon.textContent = "pause";
  updateFocusDashboardCard();
  timer = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;

      updateTimerDisplay();
      updateProgressRing();

      completeSession();

      return;
    }

    saveFocusState();

    updateTimerDisplay();

    updateProgressRing();

    updateFocusDashboardCard();
  }, 1000);
}

/* Pause Timer */
function pauseTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  saveFocusState();
  playPauseIcon.textContent = "play_arrow";
  updateFocusDashboardCard();
}

/* Reset Timer */
function resetTimer() {
  pauseTimer();
  remainingSeconds = totalSeconds;
  saveFocusState();
  updateTimerDisplay();
  updateProgressRing();
  updateFocusDashboardCard();
  switchMode(currentMode);
}

/* Skip Timer */
function skipTimer() {
  pauseTimer();
  if (currentMode === "focus") {
    switchMode("short");
  } else if (currentMode === "short") {
    switchMode("long");
  } else {
    switchMode("focus");
  }
}

/* Timer Display */
function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* Progress Ring */
const PROGRESS_RADIUS = 160;
const PROGRESS_LENGTH = 2 * Math.PI * PROGRESS_RADIUS;
function updateProgressRing() {
  const progress = remainingSeconds / totalSeconds;
  const offset = PROGRESS_LENGTH - progress * PROGRESS_LENGTH;
  progressCircle.style.strokeDashoffset = offset;
}

/* Complete Session */
function completeSession() {
  pauseTimer();

  remainingSeconds = 0;

  updateTimerDisplay();

  updateProgressRing();

  updateFocusDashboardCard();

  playNotification();

  const alarmMessage = document.getElementById("alarmMessage");

  const nextSessionText = document.getElementById("nextSessionText");

  const completedTime = document.getElementById("completedTime");

  alarmMessage.textContent = "Excellent! Your focus session has ended.";

  completedTime.textContent = `${durations.focus} Minutes Completed`;

  nextSessionText.textContent = "Next: Short Break";

  alarmMessage.textContent = "Break finished. Ready to focus again?";

  completedTime.textContent = `${durations.short} Minute Break`;

  nextSessionText.textContent = "Next: Focus Session";

  if (currentMode === "focus") {
    completedSessions++;

    focusedMinutes += durations.focus;

    saveFocusStats();

    loadFocusStats();

    showSaveToast("🎉 Focus Session Completed!");

    nextSessionMode = "short";
  } else if (currentMode === "short") {
    showSaveToast("☕ Break Finished!");

    nextSessionMode = "focus";
  } else {
    showSaveToast("🌿 Long Break Finished!");

    nextSessionMode = "focus";
  }
}

/* Save Stats */
function saveFocusStats() {
  localStorage.setItem("focusSessions", completedSessions);
  localStorage.setItem("focusMinutes", focusedMinutes);
}

/* Save Focus State */
function saveFocusState() {
  localStorage.setItem(
    "focusState",
    JSON.stringify({
      currentMode,
      remainingSeconds,
      totalSeconds,
      isRunning,
    }),
  );
}

/* Switch Timer Mode */
function switchMode(mode) {
  clearInterval(timer);

  timer = null;

  isRunning = false;

  playPauseIcon.textContent = "play_arrow";

  currentMode = mode;
  focusTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });
  switch (mode) {
    case "focus":
      totalSeconds = durations.focus * 60;
      timerStatus.textContent = "TIME TO FOCUS";
      break;
    case "short":
      totalSeconds = durations.short * 60;
      timerStatus.textContent = "SHORT BREAK";
      break;
    case "long":
      totalSeconds = durations.long * 60;
      timerStatus.textContent = "LONG BREAK";
      break;
  }
  remainingSeconds = totalSeconds;

  saveFocusState();

  updateTimerDisplay();

  updateProgressRing();

  updateFocusDashboardCard();
}

/* Duration Button */
document.querySelectorAll(".duration-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const action = btn.dataset.action;
    changeDuration(type, action);
  });
});

/* Change Duration */
function changeDuration(type, action) {
  const step = type === "focus" ? 5 : 1;
  if (action === "increase") {
    durations[type] += step;
  } else {
    durations[type] = Math.max(step, durations[type] - step);
  }
  saveDurations();
  document.getElementById(`${type}Duration`).textContent = durations[type];
  if (currentMode === type) {
    totalSeconds = durations[type] * 60;
    remainingSeconds = totalSeconds;
    saveFocusState();
    updateTimerDisplay();
    updateProgressRing();
    updateFocusDashboardCard();
  }
}

/* Update Active Tab */
function updateActiveTab() {
  focusTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === currentMode);
  });
}

/* Ambient Background */
function updateFocusTheme() {
  const page = document.getElementById("focusPage");
  if (!page) return;
  page.classList.remove("mode-focus", "mode-short", "mode-long");
  page.classList.add(`mode-${currentMode}`);
}

/* Timer Finished */
// let notificationAudio = null;

function playNotification() {
  notificationAudio = new Audio("notification.mp3");
  notificationAudio.pause();

  notificationAudio.currentTime = 0;

  notificationAudio.play();

  document.getElementById("alarmModal")?.classList.remove("hidden");
}

function stopNotification() {
  if (!notificationAudio) return;

  notificationAudio.pause();

  notificationAudio.currentTime = 0;
}

/* Update UI */
function refreshFocusUI() {
  updateTimerDisplay();
  updateProgressRing();
  updateActiveTab();
  updateFocusTheme();
  updateFocusDashboardCard();
}

/* Save Durations */
function saveDurations() {
  localStorage.setItem("focusDurations", JSON.stringify(durations));
}

/* Load Durations */
function loadDurations() {
  const saved = JSON.parse(localStorage.getItem("focusDurations"));
  if (!saved) return;
  durations = saved;
  document.getElementById("focusDuration").textContent = durations.focus;
  document.getElementById("shortDuration").textContent = durations.short;
  document.getElementById("longDuration").textContent = durations.long;
}

/* Restore Focus State */
function loadFocusState() {
  const saved = JSON.parse(localStorage.getItem("focusState"));
  if (!saved) return;
  currentMode = saved.currentMode;
  remainingSeconds = saved.remainingSeconds;
  totalSeconds = saved.totalSeconds;
  isRunning = false;
}
/* Keyboard Shortcut */
document.addEventListener("keydown", (e) => {
  if (focusPage.classList.contains("hidden")) return;
  if (e.code === "Space") {
    e.preventDefault();
    toggleTimer();
  }
});

/* Restore Focus Data */
function restoreFocusData() {
  loadDurations();
  loadFocusStats();
  loadFocusState();
  updateActiveTab();
  updateFocusTheme();
  updateTimerDisplay();
  updateProgressRing();
  updateFocusDashboardCard();
}
/* Reset Daily Stats */
function resetFocusStats() {
  completedSessions = 0;
  focusedMinutes = 0;
  saveFocusStats();
  loadFocusStats();
}

/* Page Cleanup */
function cleanupFocusTimer() {
  pauseTimer();
}

/* Window Events */
window.addEventListener("beforeunload", () => {
  saveDurations();
  saveFocusStats();
});

/* DAILY GOALS */
/* DOM Elements */
let goalsPage;
let goalInput;
let addGoalBtn;
let goalList;
let goalProgressCircle;
let goalProgressText;
let goalMotivation;
let goalCardDescription;
let goals = [];

/* Dashboard Goal Card */
let goalCardStatus;
let goalCardCount;
let goalCardProgress;

/* Initialize */
function initGoalsPage() {
  goalsPage = document.getElementById("goalsPage");
  goalInput = document.getElementById("goalInput");
  addGoalBtn = document.getElementById("addGoalBtn");
  goalList = document.getElementById("goalList");
  goalProgressCircle = document.getElementById("goalProgressCircle");
  goalProgressText = document.getElementById("goalProgressText");
  goalMotivation = document.getElementById("goalMotivation");
  goalCardStatus = document.getElementById("goalCardStatus");
  goalCardCount = document.getElementById("goalCardCount");
  goalCardProgress = document.getElementById("goalCardProgress");
  goalCardDescription = document.getElementById("goalCardDescription");
  const openMobile = document.getElementById("openGoalsMobile");
  openMobile?.addEventListener("click", showGoalsPage);
  bindGoalEvents();
  setupGoalRing();
  initializeGoals();
}

/* Navigation */
function bindGoalEvents() {
  document
    .getElementById("openGoalsCard")
    ?.addEventListener("click", showGoalsPage);
  document
    .getElementById("openGoals")
    ?.addEventListener("click", showGoalsPage);
  document
    .getElementById("backFromGoals")
    ?.addEventListener("click", hideGoalsPage);
  addGoalBtn?.addEventListener("click", addGoal);
  goalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addGoal();
    }
  });
  goalList?.addEventListener("click", handleGoalClick);
}

/* Open Goals Page */
function showGoalsPage(e) {
  e?.preventDefault();
  hideAllPages();
  document.getElementById("goalsPage")?.classList.remove("hidden");
  setActiveNav("openGoals");
  loadGoals();
}

/* Back To Dashboard */
function hideGoalsPage() {
  document.getElementById("goalsPage")?.classList.add("hidden");
  document.getElementById("dashboardPage")?.classList.remove("hidden");
}

/* Local Storage */
const GOALS_KEY = "niyamaDailyGoals";

/* Load Goals */
function loadGoals() {
  const saved = localStorage.getItem(GOALS_KEY);

  if (saved) {
    goals = JSON.parse(saved);
  } else {
    goals = [];
  }

  renderGoals();

  updateGoalProgress();

  updateGoalDashboardCard();
}

/*  Save Goals */
function saveGoals() {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

/* Progress Ring Setup */
const GOAL_RADIUS = 110;
const GOAL_CIRCUMFERENCE = 2 * Math.PI * GOAL_RADIUS;
function setupGoalRing() {
  if (!goalProgressCircle) return;
  goalProgressCircle.style.strokeDasharray = GOAL_CIRCUMFERENCE;
  goalProgressCircle.style.strokeDashoffset = GOAL_CIRCUMFERENCE;
}

/* Render Goals */
function renderGoals() {
  if (!goalList) return;
  goalList.innerHTML = "";
  goals.forEach((goal) => {
    const article = document.createElement("article");
    article.className = `goal-item ${goal.completed ? "completed" : ""}`;
    article.dataset.id = goal.id;
    article.innerHTML = `
            <button class="goal-check ${goal.completed ? "checked" : ""}">
                <span class="material-symbols-outlined">
                    check
                </span>
            </button>
            <div class="goal-info">
                <h4>
                    ${goal.title}
                </h4>
            </div>
            <button class="goal-delete">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </button>
        `;
    goalList.appendChild(article);
  });
}

/* Progress */
function updateGoalProgress() {
  if (!goalProgressText || !goalProgressCircle || !goalMotivation) return;
  const total = goals.length;
  const completed = goals.filter((goal) => goal.completed).length;
  goalProgressText.textContent = `${completed}/${total}`;
  const progress = total === 0 ? 0 : completed / total;
  const offset = GOAL_CIRCUMFERENCE - progress * GOAL_CIRCUMFERENCE;
  goalProgressCircle.style.strokeDashoffset = offset;
  updateMotivation(completed, total);
}

/* Motivation */
function updateMotivation(completed, total) {
  if (total === 0) {
    goalMotivation.textContent = "Start by adding your first goal.";
    return;
  }
  if (completed === total) {
    goalMotivation.textContent = "🎉 Amazing! All your goals are completed.";
    return;
  }
  if (completed >= total / 2) {
    goalMotivation.textContent = "💚 Great progress! Keep going.";
    return;
  }
  goalMotivation.textContent = "You're making great progress today!";
}

/* Add Goal */
function addGoal() {
  const title = goalInput.value.trim();
  if (!title) return;
  goals.unshift({
    id: Date.now(),
    title,
    completed: false,
  });
  goalInput.value = "";
  saveGoals();
  renderGoals();
  updateGoalProgress();
  updateGoalDashboardCard();
}

/* Goal List Events */
function handleGoalClick(e) {
  const item = e.target.closest(".goal-item");
  if (!item) return;
  const id = Number(item.dataset.id);
  if (e.target.closest(".goal-check")) {
    toggleGoal(id);
    return;
  }
  if (e.target.closest(".goal-delete")) {
    deleteGoal(id);
  }
}

/* Delete Goal */
function deleteGoal(id) {
  const card = goalList.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.opacity = ".3";
    card.style.transform = "translateX(20px)";
    setTimeout(() => {
      goals = goals.filter((goal) => goal.id !== id);
      saveGoals();
      renderGoals();
      updateGoalProgress();
      updateGoalDashboardCard();
    }, 250);
  }
}

/* Toggle Goal */
function toggleGoal(id) {
  goals = goals.map((goal) => {
    if (goal.id === id) {
      return {
        ...goal,
        completed: !goal.completed,
      };
    }
    return goal;
  });
  saveGoals();
  renderGoals();
  updateGoalProgress();
  updateGoalDashboardCard();
  checkGoalCompletion();
}

/* Goal Completion */
function checkGoalCompletion() {
  if (goals.length === 0) return;
  const completed = goals.filter((goal) => goal.completed).length;
  if (completed === goals.length) {
    celebrateGoals();
  }
}

/* Celebration */
function celebrateGoals() {
  const card = document.querySelector(".goal-progress-card");
  if (!card) return;
  card.classList.add("celebration");
  setTimeout(() => {
    card.classList.remove("celebration");
  }, 1500);
}

/* Progress Percentage */
function getGoalPercentage() {
  if (goals.length === 0) return 0;
  return Math.round(
    (goals.filter((goal) => goal.completed).length / goals.length) * 100,
  );
}

/* Dashboard Goal Card */

function updateGoalDashboardCard() {
  if (
    !goalCardStatus ||
    !goalCardCount ||
    !goalCardProgress ||
    !goalCardDescription
  )
    return;

  const total = goals.length;

  const completed = goals.filter((goal) => goal.completed).length;

  const remaining = total - completed;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  /* Empty State  */

  if (total === 0) {
    goalCardStatus.className = "pill pill--neutral";

    goalCardStatus.textContent = "No Goals";

    goalCardCount.textContent = "0 / 0 Goals";

    goalCardProgress.style.width = "0%";

    goalCardDescription.textContent = "Start by adding your first goal.";

    return;
  }

  /*  Normal State */

  goalCardStatus.className = "pill";

  if (percentage === 100) {
    goalCardStatus.classList.add("pill--success");
  } else if (percentage >= 60) {
    goalCardStatus.classList.add("pill--primary");
  } else if (percentage > 0) {
    goalCardStatus.classList.add("pill--warning");
  } else {
    goalCardStatus.classList.add("pill--neutral");
  }

  goalCardStatus.textContent = `${percentage}% Complete`;

  goalCardCount.textContent = `${completed} / ${total} Goals`;

  goalCardProgress.style.width = `${percentage}%`;

  if (completed === total) {
    goalCardDescription.textContent = "Excellent! All goals completed 🎉";
  } else {
    goalCardDescription.textContent = `${completed} completed • ${remaining} remaining`;
  }
}

/* Edit Goal */
goalList?.addEventListener("dblclick", (e) => {
  const item = e.target.closest(".goal-item");
  if (!item) return;
  const id = Number(item.dataset.id);
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;
  const title = prompt("Edit Goal", goal.title);
  if (title === null) return;
  if (title.trim() === "") return;
  goal.title = title.trim();
  saveGoals();
  renderGoals();
  updateGoalProgress();
});
function confirmDelete(id) {
  if (confirm("Delete this goal?")) {
    deleteGoal(id);
  }
}

/* Reset Daily Goals */
function resetGoals() {
  goals = [];
  saveGoals();
  renderGoals();
  updateGoalProgress();
  updateGoalDashboardCard();
}
refreshPlanner();

/* Page Initialization */
function initializeGoals() {
  loadGoals();
}

/* Window Save */

/* WEATHER WIDGET */

const WEATHER_API_KEY = "168771779c71f3d64106d8a88376808a";

/* DOM */
const weatherCard = document.getElementById("weatherCard");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherCity = document.getElementById("weatherCity");
const weatherDetails = document.getElementById("weatherDetails");
const weatherIcon = document.getElementById("weatherIcon");
const weatherSunrise = document.getElementById("weatherSunrise");
const weatherSunset = document.getElementById("weatherSunset");
function showWeatherLoading() {
  weatherTemp.textContent = "--°";
  weatherCondition.textContent = "Loading...";
  weatherCity.textContent = "Fetching location...";
  weatherDetails.textContent = "Please wait";
}
function showWeatherError(message) {

  weatherTemp.textContent = "--°";

  weatherCondition.textContent = "Weather Unavailable";

  weatherCity.textContent = message;

  weatherDetails.textContent = "Enable location access to view weather.";

  weatherIcon.src = "";

}
function getWeatherEmoji(condition) {
  switch (condition) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
    case "Drizzle":
      return "🌧️";
    case "Thunderstorm":
      return "⚡";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Fog":
      return "🌫️";
    default:
      return "ðŸŒ¤ï¸";
  }
}

/* Update Weather UI */
function updateWeatherUI(data) {
  const temperature = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const wind = Math.round(data.wind.speed);
  const city = data.name;
  const condition = data.weather[0].main;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  weatherTemp.textContent = `${temperature}°C`;
  weatherCondition.textContent = `${getWeatherEmoji(condition)} ${capitalize(description)}`;
  weatherCity.textContent = city;
  weatherDetails.textContent = `Feels ${feelsLike}° • Humidity ${humidity}% • Wind ${wind} km/h`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.alt = description;
  changeWeatherTheme(condition);
}
loadWeather();

/* Get Current Location */
function loadWeather() {
  showWeatherLoading();
  if (!navigator.geolocation) {

  showWeatherError("Geolocation not supported");

  return;

}

navigator.geolocation.getCurrentPosition(
  getCurrentWeather,
  () => {
    showWeatherError("Location permission denied");
  }
);
}

/* Weather using Current Location */
async function getCurrentWeather(position) {
  try {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`,
    );
    if (!response.ok) {
      throw new Error("Weather fetch failed");
    }
    const data = await response.json();
    console.log("Current Weather", data);
    updateWeatherUI(data);
  } catch (error) {
    console.error(error);
    loadDefaultCity();
  }
}
function loadDefaultCity() {

  showWeatherError("Location permission required");

}

/* Capitalize */
function capitalize(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* Dynamic Theme */
function changeWeatherTheme(condition) {
  weatherCard.classList.remove(
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-thunder",
    "weather-snow",
    "weather-mist",
  );
  switch (condition) {
    case "Clear":
      weatherCard.classList.add("weather-clear");
      break;
    case "Clouds":
      weatherCard.classList.add("weather-clouds");
      break;
    case "Rain":
    case "Drizzle":
      weatherCard.classList.add("weather-rain");
      break;
    case "Thunderstorm":
      weatherCard.classList.add("weather-thunder");
      break;
    case "Snow":
      weatherCard.classList.add("weather-snow");
      break;
    default:
      weatherCard.classList.add("weather-mist");
  }
}

/* Format Time */
function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Auto Refresh */
setInterval(loadWeather, 1800000);
