const todos = [];
let nextId = 1;

function getAll() {
  return [...todos];
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

function deleteById(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const deleted = todos.splice(index, 1);
  return deleted[0];
}

function reset() {
  todos.length = 0;
  nextId = 1;
}

module.exports = { getAll, create, updateCompleted, deleteById, reset };
