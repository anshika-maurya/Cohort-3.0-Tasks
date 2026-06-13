const main = document.createElement("main");
document.body.append(main);

const container = document.createElement("div");
container.classList.add("container");
main.append(container);

const task = document.createElement("div");
task.classList.add("task");
container.append(task);

const todos = document.createElement("div");
todos.classList.add("todos");
container.append(todos);

const input = document.createElement("input");

const button = document.createElement("button");
button.classList.add("add");
button.innerHTML = `<i class="ri-add-line"></i>`;

task.append(input, button);

button.addEventListener("click", () => {
  const value = input.value.trim();

  if (!value) return;

  const todo = document.createElement("div");
  todo.classList.add("todo-list");

  todo.innerHTML = `
        <div class="left">
            <h3>${value}</h3>
        </div>

        <div class="right">
            <button class="edit">
                <i class="ri-edit-fill"></i>
            </button>

            <button class="del">
                <i class="ri-delete-bin-5-line"></i>
            </button>
        </div>
    `;

  const title = todo.querySelector("h3");
  
  todo.querySelector(".edit").addEventListener("click", () => {
    input.value = title.textContent;
    todo.remove();
  });

  todo.querySelector(".del").addEventListener("click", () => {
    todo.remove();
  });

  todos.append(todo);
  input.value = "";
});






