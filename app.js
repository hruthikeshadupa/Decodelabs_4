const API_URL = "http://localhost:5000/api";

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const message = document.getElementById("message");
const taskCount = document.getElementById("taskCount");
const apiStatus = document.getElementById("apiStatus");
const refreshBtn = document.getElementById("refreshBtn");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#dc2626" : "#2563eb";
}

async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function checkApi() {
  try {
    const result = await request(`${API_URL}/health`);
    apiStatus.textContent = "API Online";
    apiStatus.style.color = "#15803d";
    console.log(result);
  } catch (error) {
    apiStatus.textContent = "API Offline";
    apiStatus.style.color = "#dc2626";
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("div");
    row.className = `task ${task.completed ? "done" : ""}`;

    row.innerHTML = `
      <div class="task-main">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="title"></span>
      </div>
      <div class="actions">
        <button class="delete">Delete</button>
      </div>
    `;

    row.querySelector(".title").textContent = task.title;

    row.querySelector("input").addEventListener("change", () => {
      updateTask(task.id, { completed: !task.completed });
    });

    row.querySelector(".delete").addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskList.appendChild(row);
  });

  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
}

async function loadTasks() {
  try {
    showMessage("Loading tasks...");
    const result = await request(`${API_URL}/tasks`);
    renderTasks(result.data);
    showMessage("Tasks loaded from backend.");
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

async function addTask(title) {
  try {
    const result = await request(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    showMessage(result.message);
    taskInput.value = "";
    await loadTasks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

async function updateTask(id, data) {
  try {
    const result = await request(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    showMessage(result.message);
    await loadTasks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

async function deleteTask(id) {
  try {
    const result = await request(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    });

    showMessage(result.message);
    await loadTasks();
  } catch (error) {
    showMessage(`Error: ${error.message}`, true);
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    showMessage("Please enter a task.", true);
    return;
  }

  await addTask(title);
});

refreshBtn.addEventListener("click", loadTasks);

checkApi();
loadTasks();