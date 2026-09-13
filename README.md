
## setting up and running the application locally

1. Install Node.js ≥ 22.5
2. in hw1-task, run this in this order:
npm install
npm install --prefix client
npm run dev

the SQLite db automatically is created/opened when server runs. Then click on the localhost link it shows.

## Architecture

```
┌─────────────────────┐         HTTP/JSON          ┌─────────────────────┐
│  React client       │  ───────────────────────>  │  Express API        │
│  (Vite, port 5173)  │  <───────────────────────  │  (port 3001)        │
│                     │         /api/tasks         │                     │
│  components/        │                            │  routes/tasks.js    │
│  api/tasks.js       │                            │  db.js              │
└─────────────────────┘                            └──────────┬──────────┘
                                                              │
                                                              v
                                                   ┌─────────────────────┐
                                                   │  SQLite file        │
                                                   │  data/eventually.db │
                                                   └─────────────────────┘
```
My app follows a client–server architecture. The React frontend is the client: it handles the UI (adding, listing, editing, completing, and deleting tasks) and never talks to the database directly. Instead, it sends HTTP requests to an Express API on the server. The server owns the business logic and persistence: The route handlers validate input, then read from or write to a SQLite database file (`data/eventually.db`). Then, the responses come back as JSON, and the client updates what you see on screen. In development the client runs on port 5173 and the API on port 3001; Vite proxies `/api` calls so the browser can treat them as same-origin.




## Tech stack

My stack was:
React 19 + Vite for Client UI, 
Node.js + Express for Server, 
SQLite for database, 
`concurrently` and Vite proxy for Dev tooling.

I chose this stack because it is what I am already familiar and comfortable with, and it is also one of the most common ways to build a small full-stack web app today. React and Vite made it easy to break the UI into reusable components and get a fast local development loop. On the backend, Node.js with Express keeps the server simple: a clear REST API that matches the client–server model the assignment asks for, without pulling in a heavy framework. SQLite was a natural fit for persistence because it stores everything in a single file on disk, needs no separate database service to install or run, and is more than enough for a local todo app. I use `concurrently` to start both the server and UI at the same time. During development, Vite proxies the frontend’s `/api` requests to the server, which helps avoid CORS issues.

