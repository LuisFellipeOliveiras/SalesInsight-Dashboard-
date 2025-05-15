const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const {title, description} = req.body;
  if (!title) return res.status(400).json({error: 'Title is required'});

  const stmt = db.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)');
  stmt.run(title, description || '', function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID, title, description, time_spent: 0});
  });
  stmt.finalize();
});

app.patch('/tasks/:id/time', (req, res) => {
  const {id} = req.params;
  const {timeSpent} = req.body; // seconds to add
  if (typeof timeSpent !== 'number') return res.status(400).json({error: 'timeSpent must be a number'});

  db.run('UPDATE tasks SET time_spent = time_spent + ? WHERE id = ?', [timeSpent, id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    if (this.changes === 0) return res.status(404).json({error: 'Task not found'});
    res.json({message: 'Time updated'});
  });
});

app.delete('/tasks/:id', (req, res) => {
  const {id} = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({error: err.message});
    if (this.changes === 0) return res.status(404).json({error: 'Task not found'});
    res.json({message: 'Task deleted'});
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
