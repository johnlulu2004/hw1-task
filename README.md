## setting up and running the application locally

1. Install Node.js ≥ 22.5
2. in hw1-task, run this in this order:
   npm install
   npm install --prefix client
   npm run dev

the SQLite db automatically is created/opened when server runs. Then open http://localhost:5173/.

## Architecture

My app follows a client–server architecture. The React frontend is the client: it handles the UI (adding, listing, editing, completing, and deleting tasks) and never talks to the database directly. Instead, it sends HTTP requests to an Express API on the server. The server owns the business logic and persistence: The route handlers validate input, then read from or write to a SQLite database file (`data/eventually.db`). Then, the responses come back as JSON, and the client updates what you see on screen. In development the client runs on port 5173 and the API on port 3001. Vite proxies `/api` calls so the browser can treat them as same-origin.

## Tech stack

My stack was:
React 19 + Vite for Client UI,
Node.js + Express for Server,
SQLite for database,
`concurrently` and Vite proxy for Dev tooling.

I chose this stack because it is what I am already familiar and comfortable with, and it is also one of the most common ways to build a small full-stack web app today. React and Vite makes it easy to break the UI into reusable components and get a fast local development loop. For the backend, Node.js with Express allows a clear REST API that matches the client–server model the assignment asks for. SQLite was optimal to me because it stores everything in a single file on disk, needs no separate database service to install or run, so I didn't have to use a backend-as-service or a cloud DB. I use `concurrently` to start both the server and UI at the same time. During development, Vite proxies the frontend’s `/api` requests to the server, which helps avoid CORS issues.
