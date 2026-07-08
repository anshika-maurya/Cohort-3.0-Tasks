/* ==========================================================================
   Niyama Dashboard — Behaviour
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initThemeToggle();
  initQuoteRefresh();
});

/* --- Live clock -------------------------------------------------------- */

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
  setInterval(update, 1000 * 30); // no need to tick every second
}

/* --- Theme toggle -------------------------------------------------------- */

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const icon = toggle.querySelector(".material-symbols-outlined");
  const stored = localStorage.getItem("niyama-theme");

  if (stored === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    icon.textContent = "dark_mode";
  }

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

/* --- Motivational quote refresh ----------------------------------------- */

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
      authorEl.textContent = `— ${author.toUpperCase()}`;
      textEl.style.opacity = "1";
      authorEl.style.opacity = "1";
      btn.classList.remove("is-spinning");
    }, 400);
  });
}

/* ==========================================================================
   Settings Page
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initSettingsPage();
  initProfilePreview();
  initSaveProfile();
  initResetModal();
});

/* --------------------------------------------------------------------------
   Show / Hide Settings Page
--------------------------------------------------------------------------- */

function initSettingsPage() {
  const dashboard = document.getElementById("dashboardPage");
  const settings = document.getElementById("settingsPage");

  const openBtn = document.getElementById("openSettings");
  const openMobileBtn = document.getElementById("openSettingsMobile");
  const backBtn = document.getElementById("backToDashboard");

  function showSettings() {
    if (!dashboard || !settings) return;

    dashboard.classList.add("hidden");
    settings.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showDashboard() {
    if (!dashboard || !settings) return;

    settings.classList.add("hidden");
    dashboard.classList.remove("hidden");

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
}

/* --------------------------------------------------------------------------
   Profile Image Preview
--------------------------------------------------------------------------- */

function initProfilePreview() {
  const input = document.getElementById("profileInput");
  const preview = document.getElementById("profilePreview");

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
  });
}

/* --------------------------------------------------------------------------
   Save Profile
--------------------------------------------------------------------------- */

function initSaveProfile() {
  const saveBtn = document.getElementById("saveProfile");
  const toast = document.getElementById("saveToast");

  if (!saveBtn || !toast) return;

  saveBtn.addEventListener("click", () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    setTimeout(() => {
      toast.classList.add("show");

      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes";

      setTimeout(() => {
        toast.classList.remove("show");
      }, 2500);
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   Reset Modal
--------------------------------------------------------------------------- */

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

    alert("All data has been reset.");

    // Future:
    // localStorage.clear();
    // tasks = [];
    // goals = [];
    // planner = [];
  });
}

/* ==========================================================================
   Tasks Page
========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTasksPage();
});

/* --------------------------------------------------------------------------
   Task Data
--------------------------------------------------------------------------- */

let tasks = JSON.parse(localStorage.getItem("niyamaTasks")) || [
  {
    id: Date.now(),
    title: "Finalize quarterly performance reports",
    important: false,
    completed: false,
    time: "2 hours ago",
  },
  {
    id: Date.now() + 1,
    title: "Review client feedback for FocusFlow UI",
    important: true,
    completed: false,
    time: "5 hours ago",
  },
  {
    id: Date.now() + 2,
    title: "Sync with development team",
    important: false,
    completed: true,
    time: "Completed",
  },
];

/* --------------------------------------------------------------------------
   Initialize
--------------------------------------------------------------------------- */

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

    dashboard.classList.add("hidden");
    tasksPage.classList.remove("hidden");

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
}

/* --------------------------------------------------------------------------
   Add Task
--------------------------------------------------------------------------- */

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

    time: "Just now",
  });

  input.value = "";
  important.checked = false;

  saveTasks();
  renderTasks();
}

/* --------------------------------------------------------------------------
   Render
--------------------------------------------------------------------------- */

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

              <p>${task.time}</p>

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

/* --------------------------------------------------------------------------
   Complete
--------------------------------------------------------------------------- */

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

/* --------------------------------------------------------------------------
   Important
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Delete
--------------------------------------------------------------------------- */

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();

  renderTasks();
}

/* --------------------------------------------------------------------------
   Local Storage
--------------------------------------------------------------------------- */

function saveTasks() {
  localStorage.setItem("niyamaTasks", JSON.stringify(tasks));
}

/* ==========================================================================
   PLANNER PAGE
========================================================================== */

/* --------------------------------------------------------------------------
   Planner Hours
--------------------------------------------------------------------------- */

const HOURS = [];

for(let i=0;i<24;i++){

    HOURS.push(i);

}

/* --------------------------------------------------------------------------
   Planner Events
--------------------------------------------------------------------------- */

let plannerEvents = JSON.parse(localStorage.getItem("niyamaPlannerEvents")) || [
  {
    id: 1,
    hour: 8,
    title: "Morning Routine",
    description: "",
    status: "scheduled",
  },

  {
    id: 2,
    hour: 9,
    title: "Deep Work Session",
    description: "Focus on Q4 Strategy Deck",
    status: "active",
  },

  {
    id: 3,
    hour: 10,
    title: "Weekly Team Sync",
    description: "",
    status: "scheduled",
  },

  {
    id: 4,
    hour: 12,
    title: "Lunch Break",
    description: "Walk in the Park",
    status: "scheduled",
    type: "lunch",
  },
];

/* --------------------------------------------------------------------------
   Planner Elements
--------------------------------------------------------------------------- */

let plannerPage;
let dashboardPage;

let timeline;

let plannerModal;
let deletePlannerModal;

let plannerFab;

let addPriorityBtn;

let plannerNotes;

/* --------------------------------------------------------------------------
   Initialize
--------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initPlannerPage();
});

function initPlannerPage() {
  plannerPage = document.getElementById("plannerPage");

  dashboardPage = document.getElementById("dashboardPage");

  timeline = document.getElementById("timeline");

  plannerModal = document.getElementById("plannerModal");

  deletePlannerModal = document.getElementById("deletePlannerModal");

  plannerFab = document.getElementById("plannerFab");

  addPriorityBtn = document.getElementById("addPriority");

  plannerNotes = document.getElementById("plannerNotes");

  bindPlannerEvents();

  bindTimelineEvents();
}

/* --------------------------------------------------------------------------
   Planner Events
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Show Planner
--------------------------------------------------------------------------- */

function showPlanner(e) {

    e?.preventDefault();

    dashboardPage.classList.add("hidden");
    plannerPage.classList.remove("hidden");

    updatePlannerDate();
    loadPlannerNotes();

    renderTimeline();
   updateNowLine();
    requestAnimationFrame(() => {

        const currentHour = new Date().getHours();

        const row = timeline.querySelector(
            `[data-hour="${currentHour}"]`
        );

        row?.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    });

}

/* --------------------------------------------------------------------------
   Hide Planner
--------------------------------------------------------------------------- */

function hidePlanner() {
  plannerPage.classList.add("hidden");

  dashboardPage.classList.remove("hidden");

  closeAllPlannerModals();
}

/* --------------------------------------------------------------------------
   Planner Modal
--------------------------------------------------------------------------- */

function openPlannerModal(){

    editingPlannerId = null;

    clearPlannerForm();

    plannerModal.classList.remove("hidden");

}

function closePlannerModal() {
  plannerModal.classList.add("hidden");
}

/* --------------------------------------------------------------------------
   Planner Date
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Planner Notes
--------------------------------------------------------------------------- */

function loadPlannerNotes() {
  plannerNotes.value = localStorage.getItem("niyamaPlannerNotes") || "";
}

function savePlannerNotes() {
  localStorage.setItem(
    "niyamaPlannerNotes",

    plannerNotes.value,
  );
}

/* --------------------------------------------------------------------------
   Render Timeline
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Create Timeline Row
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Empty Timeline Row
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Format Hour
--------------------------------------------------------------------------- */

function formatHour(hour){

    const suffix = hour >= 12 ? "PM" : "AM";

    let h = hour % 12;

    if(h===0){

        h=12;

    }

    return `${h}:00 ${suffix}`;

}
/* --------------------------------------------------------------------------
   Event Badge
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Focus Button
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Timeline Click Events
--------------------------------------------------------------------------- */

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

    localStorage.setItem(
        "niyamaPlannerEvents",
        JSON.stringify(plannerEvents)
    );

}

/* --------------------------------------------------------------------------
   Start Focus
--------------------------------------------------------------------------- */

function startFocus(id) {
  plannerEvents = plannerEvents.map((event) => ({
    ...event,

    status: event.id === id ? "active" : "scheduled",
  }));

  savePlannerEvents();

  renderTimeline();
}

/* --------------------------------------------------------------------------
   Stop Focus
--------------------------------------------------------------------------- */

function stopFocus(id) {
  plannerEvents = plannerEvents.map((event) => {
    if (event.id === id) {
      event.status = "scheduled";
    }

    return event;
  });

  savePlannerEvents();

  renderTimeline();
}

/* --------------------------------------------------------------------------
   Save Planner Event
--------------------------------------------------------------------------- */

document
.getElementById("savePlannerEvent")
.addEventListener("click",()=>{

    if(editingPlannerId){

        updatePlannerEvent();

    }

    else{

        savePlannerEvent();

    }

});



/* --------------------------------------------------------------------------
   Edit Planner Event
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Update Planner Event
--------------------------------------------------------------------------- */

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

  clearPlannerForm();

  closeAllPlannerModals();

  editingPlannerId = null;
}

/* --------------------------------------------------------------------------
   Delete Planner Event
--------------------------------------------------------------------------- */

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

  deletePlannerModal.classList.add("hidden");
});
function savePlannerEvent() {
  if (editingPlannerId) {
    updatePlannerEvent();

    return;
  }

  const title = document.getElementById("eventTitle").value.trim();

  if (!title) {
    alert("Please enter event title.");

    return;
  }

  plannerEvents.push({
    id: Date.now(),

    hour: Number(document.getElementById("eventHour").value),

    title,

    description: document.getElementById("eventDescription").value,

    status: document.getElementById("eventStatus").value,
  });

  plannerEvents.sort((a, b) => a.hour - b.hour);

  savePlannerEvents();

  renderTimeline();

  clearPlannerForm();

  closeAllPlannerModals();
}

/* --------------------------------------------------------------------------
   Clear Form
--------------------------------------------------------------------------- */

function clearPlannerForm(){

    document.getElementById("plannerModalTitle").textContent="Add Event";

    document.getElementById("eventTitle").value="";

    document.getElementById("eventDescription").value="";

    document.getElementById("eventStatus").value="scheduled";

    document.getElementById("eventHour").selectedIndex=0;

}
/* --------------------------------------------------------------------------
   Populate Hours
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   NOW Line
--------------------------------------------------------------------------- */

function updateNowLine() {

  const timeline = document.getElementById("timeline");
    const nowLine = document.getElementById("nowLine");

    if (!timeline || !nowLine) return;

    const currentHour = new Date().getHours();

    const currentMinute = new Date().getMinutes();

    const row = timeline.querySelector(
        `[data-hour="${currentHour}"]`
    );

    if (!row) {

        nowLine.style.display = "none";

        return;

    }

    nowLine.style.display = "block";

    const rowTop = row.offsetTop;

    const rowHeight = row.offsetHeight;

    nowLine.style.top = `${rowTop + rowHeight / 2}px`;

}

/* --------------------------------------------------------------------------
   Current Active Hour
--------------------------------------------------------------------------- */

function updateCurrentHour() {
  const hour = new Date().getHours();

  plannerEvents.forEach((event) => {
    if (event.status === "active" && event.hour !== hour) {
      event.status = "scheduled";
    }
  });
}

/* --------------------------------------------------------------------------
   Lunch Card
--------------------------------------------------------------------------- */

function isLunch(hour) {
  return hour === 12;
}

/* --------------------------------------------------------------------------
   Planner Startup
--------------------------------------------------------------------------- */

populateHourSelect();

updateCurrentHour();

// updateNowLine();

// setInterval(updateNowLine,60000);
/* --------------------------------------------------------------------------
   Timeline Event Delegation
--------------------------------------------------------------------------- */

function bindTimelineEvents() {
  if (!timeline) return;

  timeline.addEventListener("click", handleTimelineClick);
}

/* --------------------------------------------------------------------------
   Save Notes Before Exit
--------------------------------------------------------------------------- */

window.addEventListener("beforeunload", () => {
  savePlannerNotes();

  savePlannerEvents();
});

/* --------------------------------------------------------------------------
   Planner Refresh
--------------------------------------------------------------------------- */

function refreshPlanner() {
  renderTimeline();

  updateCurrentHour();

  updateNowLine();
}

/* --------------------------------------------------------------------------
   Utilities
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   ESC Key
--------------------------------------------------------------------------- */

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  closeAllPlannerModals();
});

/* --------------------------------------------------------------------------
   Modal Outside Click
--------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   Planner Init
--------------------------------------------------------------------------- */

refreshPlanner();

console.log("Planner Loaded Successfully");
