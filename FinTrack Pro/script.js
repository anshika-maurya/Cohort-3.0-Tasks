let register = document.querySelector("#register");
let registerBtn = document.querySelector("#register_btn");
let h2 = document.querySelector("h2");
let heading = document.querySelector("#heading");
let userName = document.querySelector("label");
let btn = document.querySelector("button");

if (registerBtn.textContent === "Register here") {
  registerBtn.addEventListener("click", function (e) {
    h2.textContent = "Create Account";
    heading.textContent = "Join FinTrack Pro";
    userName.textContent = "Choose a Username";
    btn.textContent = "Register";
    btn.style.backgroundColor = "#28A745";
    register.innerHTML = "Already have an account? <span>Login here</span>";
  });
}

//chart
const income = 5000;
const expenses = 100;

const ctx = document.getElementById("myChart");

new Chart(ctx, {
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
