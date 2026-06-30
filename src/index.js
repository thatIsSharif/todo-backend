const path = require('path');
const express = require('express');
const todosRouter = require('./routes/todos');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use('/api/todos', todosRouter);
  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = createApp;
