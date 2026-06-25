const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  const { sort_by, order } = req.query;
  const todos = store.getAll(sort_by, order).map(t => ({
    ...t,
    completed: !!t.completed
  }));
  res.json(todos);
});

router.post('/', (req, res) => {
  const { title, due_date } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (due_date !== undefined && due_date !== null && due_date !== '') {
    if (typeof due_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
      return res.status(400).json({ error: 'due_date must be a valid date in YYYY-MM-DD format' });
    }
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'due_date must be a valid date' });
    }
  }

  const todo = store.create(title, due_date || null);
  res.status(201).json(todo);
});

module.exports = router;
