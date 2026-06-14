let users = [
  {
    name: "Anshika",
    email: "anshika@example.com",
    image:
      "https://images.unsplash.com/photo-1488716820095-cbe80883c496?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Rohit Kewet",
    email: "rohit@example.com",
    image:
      "https://images.unsplash.com/photo-1596502059330-be10388e3ba0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sam",
    email: "sam@example.com",
    image:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Samridhi",
    email: "sam@example.com",
    image:
      "https://images.unsplash.com/photo-1623843976070-18df09402503?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

let user = document.querySelector(".user-directory");
let form = document.querySelector("form");
let inp1 = document.querySelector("#name");
let inp2 = document.querySelector("#email");
let url = document.querySelector("#url");
let btn = document.querySelector(".submit");
let changeDetail = document.querySelector(".change-detail");
let edit = document.querySelectorAll(".edit-btn");
let del = document.querySelectorAll(".delete-btn");

let editIndex = null;

function renderUsers() {
  user.innerHTML = "";

  users.forEach((elem, index) => {
    user.innerHTML += `
  <div class="card-box" data-index="${index}">
        <div class="image-box">
          <img src="${elem.image}" alt="img">
        </div>

        <div class="personal-detail">
          <p>Name: ${elem.name}</p>
          <p>Email: ${elem.email}</p>
        </div>

        <div class="change-detail">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>`;
  });
}
renderUsers();

// Add / Update User

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newUser = {
    name: inp1.value,
    email: inp2.value,
    image: url.value,
  };

  if (editIndex === null) {
    users.push(newUser);
  } else {
    users[editIndex] = newUser;
    editIndex = null;
    btn.textContent = "Submit";
  }

  renderUsers();
  form.reset();
});

//Delete + edit

user.addEventListener("click", function (e) {
  const card = e.target.closest(".card-box");

  if (!card) return;

  const index = Number(card.dataset.index);

  // delete

  if (e.target.classList.contains("delete-btn")) {
    users.splice(index, 1);
    renderUsers();
  }

  // edit

  if (e.target.classList.contains("edit-btn")) {
    inp1.value = users[index].name;
    inp2.value = users[index].email;
    url.value = users[index].image;

    editIndex = index;

    btn.textContent = "Update";
  }
});
