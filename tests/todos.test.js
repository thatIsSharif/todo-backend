const assert = require('node:assert/strict');
const { describe, it, beforeEach, afterEach } = require('node:test');
const http = require('http');
const store = require('../src/store');

function createServer() {
  const createApp = require('../src/index');
  const app = createApp();
  return app.listen(0); // random available port
}

function fetchJson(server, method, path, body) {
  const { port } = server.address();
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Todos API', () => {
  let server;

  beforeEach(() => {
    store.reset();
    // Clear module cache so routes get fresh store reference
    delete require.cache[require.resolve('../src/index')];
    delete require.cache[require.resolve('../src/routes/todos')];
    server = createServer();
  });

  afterEach(() => {
    server.close();
  });

  it('GET /api/todos returns an empty array initially', async () => {
    const res = await fetchJson(server, 'GET', '/api/todos');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  it('POST /api/todos creates a new todo', async () => {
    const res = await fetchJson(server, 'POST', '/api/todos', { title: 'Test todo' });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Test todo');
    assert.equal(res.body.completed, false);
    assert.ok(res.body.id);
  });

  it('POST /api/todos rejects empty title', async () => {
    const res = await fetchJson(server, 'POST', '/api/todos', { title: '' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Title is required');
  });

  it('POST /api/todos rejects missing title', async () => {
    const res = await fetchJson(server, 'POST', '/api/todos', {});
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Title is required');
  });

  it('POST /api/todos trims whitespace-only titles', async () => {
    const res = await fetchJson(server, 'POST', '/api/todos', { title: '   ' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Title is required');
  });

  it('GET /api/todos returns created todos', async () => {
    await fetchJson(server, 'POST', '/api/todos', { title: 'First todo' });
    await fetchJson(server, 'POST', '/api/todos', { title: 'Second todo' });

    const res = await fetchJson(server, 'GET', '/api/todos');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.equal(res.body[0].title, 'First todo');
    assert.equal(res.body[1].title, 'Second todo');
  });
});
