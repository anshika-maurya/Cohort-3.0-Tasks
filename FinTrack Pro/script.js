const loginForm = document.querySelector(".form-container");
const dashboard = document.querySelector(".dashboard");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const title = document.querySelector("h2");
const heading = document.getElementById("heading");
const usernameLabel = document.querySelector("label[for='username']");
const userNameDisplay = document.querySelector(".user-name");

const registerBtn = document.getElementById("register_btn");
const registerText = document.getElementById("registerText");

const balanceCard = document.getElementById("balance");
const incomeCard = document.getElementById("income");
const expenseCard = document.getElementById("expense");
const transactionCountCard = document.getElementById("transactionCount");

let isRegisterMode = false;


// Toggle Login/Register

function toggleForm() {
  isRegisterMode = !isRegisterMode;

  if (isRegisterMode) {
    title.textContent = "Create Account";
    heading.textContent = "Join FinTrack Pro";
    usernameLabel.textContent = "Choose a Username";

    loginBtn.textContent = "Register";
    loginBtn.style.backgroundColor = "#28A745";

    registerText.textContent = "Already have an account?";
    registerBtn.textContent = "Login here";
  } else {
    title.textContent = "Welcome Back";
    heading.textContent = "Login to FinTrack Pro";
    usernameLabel.textContent = "Username";

    loginBtn.textContent = "Login";
    loginBtn.style.backgroundColor = "#0056B3";

    registerText.textContent = "Don't have an account?";
    registerBtn.textContent = "Register here";
  }
}

registerBtn.addEventListener("click", toggleForm);

// Login / Register

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please fill all fields.");
    return;
  }

  // Register

  if (isRegisterMode) {
    if (localStorage.getItem("username")) {
      alert("User already exists.");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration Successful.");

    usernameInput.value = "";
    passwordInput.value = "";

    toggleForm();

    return;
  }

  // Login

  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");

  if (username === savedUsername && password === savedPassword) {
    localStorage.setItem("isLoggedIn", "true");

    showDashboard();
  } else {
    alert("Invalid Username or Password.");
  }
});

// Dashboard

function showDashboard() {
  loginForm.style.display = "none";
  dashboard.style.display = "flex";

  userNameDisplay.textContent = localStorage.getItem("username");
}

// Session Check

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  } else {
    loginForm.style.display = "flex";
    dashboard.style.display = "none";
  }
});

// Logout

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");

  loginForm.style.display = "flex";
  dashboard.style.display = "none";

  usernameInput.value = "";
  passwordInput.value = "";
});
//chart
const income = 5000;
const expenses = 100;

const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
  type: "bar",

  data: {
    labels: ["Income vs Expenses"],

    datasets: [
      {
        label: "Income",
        data: [income],
        backgroundColor: "#166534",
        barThickness: 230,
        borderRadius: 2,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
      {
        label: "Expenses",
        data: [expenses],
        backgroundColor: "#991B1B",
        barThickness: 230,
        borderRadius: 2,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
    ],
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 40,
          boxHeight: 12,
          padding: 20,
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },

      tooltip: {
        backgroundColor: "#111827",

        callbacks: {
          label(context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          callback(value) {
            return value.toLocaleString();
          },
          color: "#6b7280",
        },

        grid: {
          color: "#e5e7eb",
        },

        border: {
          display: false,
        },
      },
    },
  },
});

//Add transaction

const modal = document.querySelector(".modal");

const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");

const saveTransactionBtn = document.getElementById("saveTransaction");

const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("transactionType");

const transactionBody = document.getElementById("transactionBody");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const resetBtn = document.querySelector(".reset-btn");

const dashboardPage = document.getElementById("dashboardPage");
const settingsPage = document.getElementById("settingsPage");

const dashboardMenu = document.getElementById("dashboardMenu");
const settingsMenu = document.getElementById("settingsMenu");

const nameInput = document.getElementById("name");
const currencyInput = document.getElementById("currency");
const saveBtn = document.querySelector(".save-btn");
const themeToggle = document.getElementById("themeToggle");

let editingId = null;

function getCurrencySymbol() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!profile) return "₹";

  switch (profile.currency) {
    case "USD ($)":
      return "$";

    case "EUR (€)":
      return "€";

    case "INR (₹)":
    default:
      return "₹";
  }
}

//open modal

openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

//close modal

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

//close when clicking outside

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Save Transaction

saveTransactionBtn.addEventListener("click", () => {
  console.log("Selected:", typeInput.value);
  const transaction = {
    id: Date.now(),

    type: typeInput.value,

    description: descriptionInput.value.trim(),

    amount: Number(amountInput.value),

    date: dateInput.value,

    category: categoryInput.value,
  };

  // Validation

  if (
    transaction.description === "" ||
    transaction.amount <= 0 ||
    transaction.date === "" ||
    transaction.category === "Select a category"
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (editingId === null) {
    transactions.push(transaction);
  } else {
    const index = transactions.findIndex((transaction) => {
      return transaction.id === editingId;
    });

    transaction.id = editingId;

    transactions[index] = transaction;

    editingId = null;
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummary();
  updateChart();
  clearForm();

  modal.style.display = "none";
});

//clear form

function clearForm() {
  typeInput.value = "Expense";

  descriptionInput.value = "";

  amountInput.value = "";

  dateInput.value = "";

  categoryInput.selectedIndex = 0;
}

//Render Transactions

function renderTransactions() {
  transactionBody.innerHTML = "";

  transactions.forEach((transaction) => {
    transactionBody.innerHTML += `

        <tr>

            <td>${transaction.date}</td>

            <td>
                <strong>${transaction.description}</strong>
            </td>

            <td>
                <span class="category ${transaction.category.toLowerCase().replace(/\s+/g, "-")}">
                    ${transaction.category}
                </span>
            </td>

            <td class="${transaction.type === "Income" ? "income" : "expense"}">

                ${transaction.type === "Income" ? "+" : "-"}${getCurrencySymbol()}${transaction.amount.toFixed(2)}}

            </td>

            <td class="actions">

                <button class="edit-btn" data-id="${transaction.id}">
                    <i class="ri-pencil-fill"></i>
                </button>

                <button class="delete-btn" data-id="${transaction.id}">
                    <i class="ri-delete-bin-7-fill"></i>
                </button>

            </td>

        </tr>

        `;
  });
}

//Load Data on Refresh

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  } else {
    loginForm.style.display = "flex";
    dashboard.style.display = "none";
  }

  renderTransactions();
  updateSummary();
  updateChart();
  loadProfile();
});

//delete transaction

transactionBody.addEventListener("click", (e) => {
  // Delete

  if (e.target.closest(".delete-btn")) {
    const id = Number(e.target.closest(".delete-btn").dataset.id);

    deleteTransaction(id);
  }

  //edit

  if (e.target.closest(".edit-btn")) {
    const id = Number(e.target.closest(".edit-btn").dataset.id);

    editTransaction(id);
  }
});

function deleteTransaction(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this transaction?",
  );

  if (!confirmDelete) return;

  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();

  updateSummary();

  updateChart();
}

//Edit transaction

function editTransaction(id) {
  const transaction = transactions.find((transaction) => {
    return transaction.id === id;
  });

  editingId = id;

  typeInput.value = transaction.type;

  descriptionInput.value = transaction.description;

  amountInput.value = transaction.amount;

  dateInput.value = transaction.date;

  categoryInput.value = transaction.category;

  modal.style.display = "flex";
}

//update balance card

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "Income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  balanceCard.textContent = `${getCurrencySymbol()}${balance.toFixed(2)}`;

  incomeCard.textContent = `${getCurrencySymbol()}${totalIncome.toFixed(2)}`;

  expenseCard.textContent = `${getCurrencySymbol()}${totalExpense.toFixed(2)}`;

  transactionCountCard.textContent = transactions.length;
}

//update chart

function updateChart() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "Income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  chart.data.datasets[0].data = [totalIncome];
  chart.data.datasets[1].data = [totalExpense];

  chart.update();
}
localStorage.setItem("transactions", JSON.stringify(transactions));

renderTransactions();
updateSummary();
updateChart();

clearForm();

modal.style.display = "none";

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  } else {
    loginForm.style.display = "flex";
    dashboard.style.display = "none";
  }

  renderTransactions();
  updateSummary();
  updateChart();
});

//reset data

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm(
    "Are you sure you want to delete all transactions?",
  );

  if (!confirmReset) return;

  transactions = [];

  localStorage.removeItem("transactions");

  renderTransactions();
  updateSummary();
  updateChart();

  clearForm();

  modal.style.display = "none";

  alert("All transaction data has been reset successfully.");
});

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm(
    "Are you sure you want to delete all transactions?",
  );

  if (!confirmReset) return;

  transactions = [];

  localStorage.removeItem("transactions");

  renderTransactions();
  updateSummary();
  updateChart();

  clearForm();

  modal.style.display = "none";

  alert("All transaction data has been reset successfully.");
});

//aside bar

function showPage(page) {
  // Hide all pages
  dashboardPage.style.display = "none";
  settingsPage.style.display = "none";

  // Remove active class
  dashboardMenu.classList.remove("active");
  settingsMenu.classList.remove("active");

  if (page === "dashboard") {
    dashboardPage.style.display = "flex";
    dashboardMenu.classList.add("active");
  } else if (page === "settings") {
    settingsPage.style.display = "block";
    settingsMenu.classList.add("active");
  }
}

dashboardMenu.addEventListener("click", () => {
  showPage("dashboard");
});

settingsMenu.addEventListener("click", () => {
  showPage("settings");
});

//profile-setting-page

saveBtn.addEventListener("click", () => {
  const profile = {
    name: nameInput.value.trim(),

    currency: currencyInput.value,
  };

  if (profile.name === "") {
    alert("Please enter your name.");
    return;
  }

  localStorage.setItem("profile", JSON.stringify(profile));

  localStorage.setItem("profile", JSON.stringify(profile));

  applyProfileSettings();

  alert("Profile Updated Successfully.");
});

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!profile) return;

  nameInput.value = profile.name;

  currencyInput.value = profile.currency;

  document.querySelector(".user-name").textContent = profile.name;
}

function getCurrencySymbol() {
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!profile) return "₹";

  switch (profile.currency) {
    case "USD ($)":
      return "$";

    case "EUR (€)":
      return "€";

    default:
      return "₹";
  }
}

//update dashboard by setting page update

function applyProfileSettings() {
  loadProfile();

  renderTransactions();

  updateSummary();

  updateChart();
}

//theme

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");

  themeToggle.checked = true;
}

//toggel theme

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-mode");

    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme", "light");
  }
});
