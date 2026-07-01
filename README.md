# todo-backend

Backend API for a todo application built with Express and Node.js.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v4.21.0
- **Data Store:** In-memory (ephemeral)
- **Testing:** Node.js native test runner (`node:test`)

## API Endpoints

All endpoints are prefixed with `/api/todos`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/todos` | Retrieve all todos |
| `POST` | `/api/todos` | Create a new todo (`{ "title": "..." }`) |
| `PATCH` | `/api/todos/:id` | Update todo completion status (`{ "completed": true/false }`) |
| `DELETE` | `/api/todos/:id` | Delete a todo by ID |

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)

### Install

```bash
npm install
```

### Run

```bash
# Start the server on port 3000
npm start
```

The server will start on the port specified by the `PORT` environment variable (default: 3000).

### Development

```bash
# Run with auto-restart on file changes
npm run dev
```

## Running Tests

```bash
npm test
```

The test suite covers all CRUD operations including validation and error handling.