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

module.exports = router;
