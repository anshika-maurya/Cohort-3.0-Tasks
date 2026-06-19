const themeToggle = document.querySelector(".theme-toggle");

const menuTitles = document.querySelectorAll(".menu-title");

menuTitles.forEach((title) => {
  title.addEventListener("click", () => {
    title.nextElementSibling.classList.toggle("show");
  });
});

const currentDate = document.querySelector(".current-date");

const projectsContainer = document.querySelector(".projects");
const tasksContainer = document.querySelector(".tasks");
const sidebarProjects = document.querySelector(".sidebar-projects");

const searchInput = document.querySelector(".search-box input");

const totalTasks = document.querySelector(".total-tasks");
const progressTasks = document.querySelector(".progress-tasks");
const completedTasks = document.querySelector(".completed-tasks");

const taskHeading = document.querySelector(".task-heading");

const filterContainer = document.querySelector(".task-filters");

const modalOverlay = document.querySelector(".modal-overlay");

const closeModalBtn = document.querySelector(".close-modal");

const taskForm = document.querySelector("#task-form");

const taskTitle = document.querySelector("#task-title");

const taskProject = document.querySelector("#task-project");

const taskStatus = document.querySelector("#task-status");

const addTaskMenuBtn = document.querySelector(".add-task-menu");

const addProjectBtn = document.querySelector(".add-project");

const projectModalOverlay = document.querySelector(".project-modal-overlay");

const closeProjectModalBtn = document.querySelector(".close-project-modal");

const projectForm = document.querySelector("#project-form");

const projectName = document.querySelector("#project-name");

const projectDescription = document.querySelector("#project-description");

const projectColor = document.querySelector("#project-color");
const bannerImg = document.querySelector("#banner-img");

let projects = JSON.parse(localStorage.getItem("projects")) || [
  {
    id: 1,
    name: "Next Task",
    description: "Task Manager",
    color: "pink",
  },

  {
    id: 2,
    name: "Movie Hub",
    description: "Full Stack App",
    color: "yellow",
  },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 1,
    projectId: 1,
    title: "Create Dashboard Layout",
    status: "pending",
  },

  {
    id: 2,
    projectId: 1,
    title: "Build Task Components",
    status: "progress",
  },

  {
    id: 3,
    projectId: 1,
    title: "Responsive Design Setup",
    status: "completed",
  },
];

let selectedProject = null;
let selectedFilter = "all";
let searchValue = "";
let showAllTasks = false;

function saveData() {
  localStorage.setItem("projects", JSON.stringify(projects));

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  totalTasks.textContent = tasks.length;

  progressTasks.textContent = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  completedTasks.textContent = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  document.querySelector(".all-count").textContent = tasks.length;

  document.querySelector(".progress-count").textContent = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  document.querySelector(".done-count").textContent = tasks.filter(
    (task) => task.status === "completed",
  ).length;
}

function getFilteredTasks() {
  let filtered = [...tasks];

  if (selectedProject) {
    filtered = filtered.filter((task) => task.projectId === selectedProject);
  }

  if (selectedFilter !== "all") {
    filtered = filtered.filter((task) => task.status === selectedFilter);
  }

  if (searchValue) {
    filtered = filtered.filter((task) =>
      task.title.toLowerCase().includes(searchValue),
    );
  }

  return filtered;
}

function renderSidebarProjects() {
  let html = `
<li
 class="sidebar-project"
 data-id="all"
>
 All Projects
</li>
`;

  projects.forEach((project) => {
    const count = tasks.filter((task) => task.projectId === project.id).length;

    html += `
      <li
        class="sidebar-project"
        data-id="${project.id}"
      >
        ${project.name} (${count})
      </li>
    `;
  });

  sidebarProjects.innerHTML = html;
}

function renderProjects() {
  let html = "";

  const recentProjects = projects.slice(-2);

  recentProjects.forEach((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);

    const completedCount = projectTasks.filter(
      (task) => task.status === "completed",
    ).length;

    html += `
      <div
        class="project-card ${project.color}"
        data-id="${project.id}"
      >

        <div class="project-top">
          <i class="ri-checkbox-circle-fill"></i>
          <i class="ri-more-2-fill"></i>
        </div>

        <div class="project-info">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
        </div>

        <div class="project-footer">

          <p>
            ${projectTasks.length}
            Tasks •
            ${completedCount}
            Done
          </p>

          <div class="progress">

            <div
              class="progress-fill"
              style="
                width:
                ${
                  projectTasks.length
                    ? (completedCount / projectTasks.length) * 100
                    : 0
                }%;
              "
            ></div>

          </div>

        </div>

      </div>
    `;
  });

  projectsContainer.innerHTML = html;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  const dashboardTasks = showAllTasks
    ? filteredTasks
    : filteredTasks.slice(0, 3);

  taskHeading.textContent = `Current Tasks (${dashboardTasks.length})`;

  let html = "";

  dashboardTasks.forEach((task) => {
    const project = projects.find((p) => p.id === task.projectId);

    html += `
<div class="task-card ${task.status}-card">

  <div class="task-top">

    <span class="project-name">
      Project: ${project.name}
    </span>

    <div class="task-right">

      <span class="status ${task.status}">
        <span class="dot"></span>

        ${
          task.status === "progress"
            ? "In Progress"
            : task.status.charAt(0).toUpperCase() + task.status.slice(1)
        }
      </span>

      <input
        type="checkbox"
        class="task-checkbox"
        data-id="${task.id}"
        ${task.status === "completed" ? "checked" : ""}
      >

      <button
        class="delete-btn"
        data-id="${task.id}"
      >
        <i class="ri-delete-bin-line"></i>
      </button>

    </div>

  </div>

  <h3>${task.title}</h3>

</div>
`;
  });

  html += `
    <button class="add-task-btn">
      <i class="ri-add-fill"></i>
      Add a new task
    </button>
  `;

  tasksContainer.innerHTML = html;
}

function populateProjectSelect() {
  let html = "";

  projects.forEach((project) => {
    html += `
      <option value="${project.id}">
        ${project.name}
      </option>
    `;
  });

  taskProject.innerHTML = html;
}

function openModal() {
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");

  taskForm.reset();
}

function openProjectModal() {
  projectModalOverlay.classList.remove("hidden");
}

function closeProjectModal() {
  projectModalOverlay.classList.add("hidden");

  projectForm.reset();
}
function addTask(title, projectId, status) {
  tasks.push({
    id: Date.now(),
    title,
    projectId: Number(projectId),
    status,
  });
  saveData();
  renderProjects();
  renderSidebarProjects();
  renderTasks();
  updateStats();
  closeModal();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveData();
  renderProjects();
  renderSidebarProjects();
  renderTasks();
  updateStats();
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) return;

  task.status = task.status === "completed" ? "pending" : "completed";
  saveData();
  renderProjects();
  renderSidebarProjects();
  renderTasks();
  updateStats();
}

function addProject(name, description, color) {
  projects.push({
    id: Date.now(),
    name,
    description,
    color,
  });
  saveData();
  renderProjects();
  renderSidebarProjects();
  populateProjectSelect();

  closeProjectModal();
}

addProjectBtn.addEventListener("click", openProjectModal);

closeProjectModalBtn.addEventListener("click", closeProjectModal);

projectModalOverlay.addEventListener("click", (e) => {
  if (e.target === projectModalOverlay) {
    closeProjectModal();
  }
});

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = projectName.value.trim();

  const description = projectDescription.value.trim();

  const color = projectColor.value;

  if (!name || !description) return;

  addProject(name, description, color);
});

addTaskMenuBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();

  const projectId = taskProject.value;

  const status = taskStatus.value;

  if (!title) return;

  addTask(title, projectId, status);
});

searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();

  renderTasks();
});
document.addEventListener("change", (e) => {
  const checkbox = e.target.closest(".task-checkbox");

  if (!checkbox) return;

  toggleTask(Number(checkbox.dataset.id));
});

filterContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter;

  if (!filter) return;

  selectedFilter = filter;

  renderTasks();
});

document.addEventListener("click", (e) => {
  const projectCard = e.target.closest(".project-card");

  const sidebarProject = e.target.closest(".sidebar-project");

  const addTaskBtn = e.target.closest(".add-task-btn");

  const deleteBtn = e.target.closest(".delete-btn");

  if (addTaskBtn) {
    openModal();
  }

  if (deleteBtn) {
    deleteTask(Number(deleteBtn.dataset.id));
  }

  if (projectCard) {
    selectedProject = Number(projectCard.dataset.id);

    renderTasks();
  }

  if (sidebarProject) {
    if (sidebarProject.dataset.id === "all") {
      selectedProject = null;
    } else {
      selectedProject = Number(sidebarProject.dataset.id);
    }

    renderTasks();
  }
});

document.querySelector(".view-all-tasks").addEventListener("click", () => {
  showAllTasks = !showAllTasks;

  document.querySelector(".view-all-tasks").textContent = showAllTasks
    ? "Show Less"
    : "View All";

  renderTasks();
});

function showDate() {
  const today = new Date();

  const options = {
    day: "numeric",
    month: "long",
  };

  currentDate.textContent = `Today, ${today.toLocaleDateString(
    "en-GB",
    options,
  )}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    bannerImg.src = "./Images/banner2.png";

    themeToggle.classList.remove("ri-moon-line");

    themeToggle.classList.add("ri-sun-line");
  } else {
    bannerImg.src = "./Images/banner.png";

    themeToggle.classList.remove("ri-sun-line");

    themeToggle.classList.add("ri-moon-line");
  }

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

themeToggle.addEventListener("click", toggleTheme);
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  bannerImg.src = "./Images/banner2.png";

  themeToggle.classList.remove("ri-moon-line");

  themeToggle.classList.add("ri-sun-line");
}

populateProjectSelect();

renderProjects();
renderSidebarProjects();
renderTasks();
updateStats();
showDate();
