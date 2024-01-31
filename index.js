const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.sqlite');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users(id INT, name TEXT)');
});

fastify.get('/users', (request, reply) => {
  db.all('SELECT id, name FROM users', (err, rows) => {
    reply.send(rows);
  });
});

fastify.post('/users', (request, reply) => {
  let stmt = db.prepare('INSERT INTO users VALUES (?, ?)');
  stmt.run(request.body.id, request.body.name);
  stmt.finalize();
  reply.send('User added');
});

fastify.put('/users/:id', (request, reply) => {
  let stmt = db.prepare('UPDATE users SET name = ? WHERE id = ?');
  stmt.run(request.body.name, request.params.id);
  stmt.finalize();
  reply.send('User updated');
});

fastify.delete('/users/:id', (request, reply) => {
  let stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(request.params.id);
  stmt.finalize();
  reply.send('User deleted');
});

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});