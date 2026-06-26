const todos = [];
let nextId = 1;

function getAll() {
  return todos;
}

function create(title) {
  const todo = { id: nextId++, title: title.trim(), completed: false };
  todos.push(todo);
  return todo;
}

function updateCompleted(id, completed) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  todo.completed = completed;
  return todo;
}

function reset() {
  todos.length = 0;
  nextId = 1;
}

module.exports = { getAll, create, updateCompleted, reset };
