const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn REST API", completed: true },
  { id: 2, title: "Connect frontend with backend", completed: false },
  { id: 3, title: "Test API using browser", completed: false }
];

let nextId = 4;

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running",
    timestamp: new Date().toISOString()
  });
});

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks
  });
});

// POST a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task
  });
});

// PUT a task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(item => item.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const { title, completed } = req.body;

  if (typeof title === "string" && title.trim()) {
    task.title = title.trim();
  }

  if (typeof completed === "boolean") {
    task.completed = completed;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task
  });
});

// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask
  });
});

// Unknown route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});