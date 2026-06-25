const express = require('express');
const todosRouter = require('./routes/todos');

function createApp() {
  const app = express();
  app.use(express.json());
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
