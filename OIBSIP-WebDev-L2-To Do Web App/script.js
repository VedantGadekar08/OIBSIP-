document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const taskForm = document.getElementById("task-form");
  const newTaskInput = document.getElementById("new-task-input");
  const pendingList = document.getElementById("pending-list");
  const completedList = document.getElementById("completed-list");
  const pendingCount = document.getElementById("pending-count");
  const completedCount = document.getElementById("completed-count");
  const pendingEmpty = document.getElementById("pending-empty");
  const completedEmpty = document.getElementById("completed-empty");
  const taskTemplate = document.getElementById("task-template");

  // State
  let tasks = JSON.parse(localStorage.getItem("FlowTasks")) || [];

  // Initialize
  function init() {
    renderTasks();
    updateUI();
  }

  // Save to localStorage
  function saveTasks() {
    localStorage.setItem("FlowTasks", JSON.stringify(tasks));
    updateUI();
  }

  // Format date string
  function formatDate(dateString) {
    if (!dateString) return "";
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  // Generate unique ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Create Task Element
  function createTaskElement(task) {
    const clone = taskTemplate.content.cloneNode(true);
    const taskItem = clone.querySelector(".task-item");

    taskItem.dataset.id = task.id;

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const taskText = taskItem.querySelector(".task-text");
    taskText.textContent = task.text;

    // Timestamps
    const addedTime = taskItem.querySelector(".added-time .time-text");
    addedTime.textContent = `Added ${formatDate(task.createdAt)}`;

    const completedTime = taskItem.querySelector(".completed-time");
    if (task.completedAt) {
      completedTime.querySelector(".time-text").textContent =
        `Done ${formatDate(task.completedAt)}`;
      completedTime.classList.remove("hidden");
    }

    // Setup Event Listeners within the item

    // Complete/Uncomplete
    const btnCheck = taskItem.querySelector(".btn-check");
    btnCheck.addEventListener("click", () => toggleTaskStatus(task.id));

    // Delete
    const btnDelete = taskItem.querySelector(".btn-delete");
    btnDelete.addEventListener("click", () => {
      taskItem.classList.add("removing");
      setTimeout(() => deleteTask(task.id), 300); // Wait for animation
    });

    // Edit
    const btnEdit = taskItem.querySelector(".btn-edit");
    const editForm = taskItem.querySelector(".edit-form");
    const editInput = taskItem.querySelector(".edit-input");
    const btnCancelEdit = taskItem.querySelector(".btn-cancel-edit");

    btnEdit.addEventListener("click", () => {
      taskText.classList.add("hidden");
      editForm.classList.remove("hidden");
      editInput.value = task.text;
      editInput.focus();
    });

    btnCancelEdit.addEventListener("click", () => {
      taskText.classList.remove("hidden");
      editForm.classList.add("hidden");
    });

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newText = editInput.value.trim();
      if (newText) {
        updateTask(task.id, newText);
      }
    });

    return taskItem;
  }

  // Add Task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = newTaskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();

    newTaskInput.value = "";
  });

  // Toggle Status
  function toggleTaskStatus(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      saveTasks();
      renderTasks();
    }
  }

  // Update Task
  function updateTask(id, newText) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.text = newText;
      saveTasks();
      renderTasks();
    }
  }

  // Delete Task
  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }

  // Render all tasks
  function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task) => {
      const taskEl = createTaskElement(task);
      if (task.completed) {
        completedList.appendChild(taskEl);
      } else {
        pendingList.appendChild(taskEl);
      }
    });
  }

  // Update UI Counters and Empty States
  function updateUI() {
    const pendingTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    pendingCount.textContent = `${pendingTasks.length} pending`;
    completedCount.textContent = `${completedTasks.length} completed`;

    if (pendingTasks.length === 0) {
      pendingEmpty.style.display = "block";
      pendingList.style.display = "none";
    } else {
      pendingEmpty.style.display = "none";
      pendingList.style.display = "flex";
    }

    if (completedTasks.length === 0) {
      completedEmpty.style.display = "block";
      completedList.style.display = "none";
    } else {
      completedEmpty.style.display = "none";
      completedList.style.display = "flex";
    }
  }

  // Start App
  init();
});
