# Full Stack Project 4 – Frontend & Backend Integration

This project demonstrates a complete frontend-to-backend integration using:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Communication: REST API using `fetch()`, JSON, async/await
- CORS handling
- HTTP status codes
- Error handling with try/catch

## Project structure

```text
fullstack_project4/
├── backend/
│   ├── package.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```

## Requirements

Install Node.js LTS.

## Run the backend

Open VS Code terminal:

```bash
cd backend
npm install
npm start
```

Backend runs at:

http://localhost:5000

Test:

http://localhost:5000/api/health

## Run the frontend

Open `frontend/index.html` with Live Server in VS Code.

Or use any local static server.

The frontend calls:

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

## How the integration works

Browser → `fetch()` → Express REST API → JSON response → UI update.

The backend uses an in-memory array for demonstration. Restarting the server resets the data.
