const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  res.json(store.getAll());
});

router.post('/', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = store.create(title);
  res.status(201).json(todo);
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed status is required' });
  }

  const todo = store.updateCompleted(id, completed);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

module.exports = router;
