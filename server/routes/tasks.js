/**
 * Task routes — create, list, update, complete, and delete todos.
 */

const express = require('express');
const db = require('../db');

const router = express.Router();

/** Convert a DB row into a JSON-friendly task object. */
function mapTask(row) {
  return {
    id: row.id,
    description: row.description,
    deadline: row.deadline,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}

/**
 * GET /api/tasks
 * Optional query params: q (keyword), status (all|pending|completed),
 * sort (deadline_asc|deadline_desc|created_desc)
 */
router.get('/', (req, res) => {
  const { q = '', status = 'all', sort = 'deadline_asc' } = req.query;

  const clauses = [];
  const params = {};

  if (q.trim()) {
    clauses.push('description LIKE @q');
    params.q = `%${q.trim()}%`;
  }

  if (status === 'pending') {
    clauses.push('completed = 0');
  } else if (status === 'completed') {
    clauses.push('completed = 1');
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const orderBy =
    {
      deadline_asc: 'deadline ASC',
      deadline_desc: 'deadline DESC',
      created_desc: 'created_at DESC',
      status: 'completed ASC, deadline ASC',
    }[sort] || 'deadline ASC';

  const rows = db
    .prepare(`SELECT * FROM tasks ${where} ORDER BY ${orderBy}`)
    .all(params);

  res.json(rows.map(mapTask));
});

/**
 * POST /api/tasks
 * Body: { description, deadline }
 */
router.post('/', (req, res) => {
  const { description, deadline } = req.body;

  if (!description || !String(description).trim()) {
    return res.status(400).json({ error: 'Description is required.' });
  }
  if (!deadline) {
    return res.status(400).json({ error: 'Deadline is required.' });
  }

  const result = db
    .prepare(
      `INSERT INTO tasks (description, deadline, completed)
       VALUES (@description, @deadline, 0)`
    )
    .run({
      description: String(description).trim(),
      deadline: String(deadline),
    });

  const row = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(mapTask(row));
});

/**
 * PUT /api/tasks/:id
 * Body: { description?, deadline?, completed? }
 */
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const description =
    req.body.description !== undefined
      ? String(req.body.description).trim()
      : existing.description;
  const deadline =
    req.body.deadline !== undefined
      ? String(req.body.deadline)
      : existing.deadline;
  const completed =
    req.body.completed !== undefined
      ? req.body.completed
        ? 1
        : 0
      : existing.completed;

  if (!description) {
    return res.status(400).json({ error: 'Description is required.' });
  }
  if (!deadline) {
    return res.status(400).json({ error: 'Deadline is required.' });
  }

  db.prepare(
    `UPDATE tasks
     SET description = @description, deadline = @deadline, completed = @completed
     WHERE id = @id`
  ).run({ id, description, deadline, completed });

  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(mapTask(row));
});

/**
 * PATCH /api/tasks/:id/complete
 * Marks a task as completed (or toggles if body.toggle is true).
 */
router.patch('/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const completed = req.body?.toggle ? (existing.completed ? 0 : 1) : 1;

  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed, id);

  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(mapTask(row));
});

/**
 * DELETE /api/tasks/:id
 */
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

module.exports = router;
