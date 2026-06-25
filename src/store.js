const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'todos.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        due_date TEXT NULLABLE,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}

function getAll(sortBy, order) {
  const validSortColumns = ['created_at', 'due_date', 'title'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  const stmt = getDb().prepare(
    `SELECT * FROM todos ORDER BY ${sortColumn} ${sortOrder}`
  );
  return stmt.all();
}

function create(title, dueDate) {
  const stmt = getDb().prepare(
    'INSERT INTO todos (title, due_date) VALUES (?, ?)'
  );
  const result = stmt.run(title.trim(), dueDate || null);
  const todo = getDb().prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  return { ...todo, completed: !!todo.completed };
}

function reset() {
  getDb().exec("DELETE FROM todos; DELETE FROM sqlite_sequence WHERE name='todos'");
}

// Close DB on exit
process.on('exit', () => {
  if (db) db.close();
});

module.exports = { getAll, create, reset };
