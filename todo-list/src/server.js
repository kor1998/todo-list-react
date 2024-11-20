/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MySQL Connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todolist'
});

con.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);  // Exit the process with an error
  }
  console.log('Connected to MySQL');
});

// API to Get Todos
app.get('/api/todos', (req, res) => {
  con.query('SELECT * FROM todos', (err, results) => {
      if (err) {
          console.error('Error fetching todos:', err);
          return res.status(500).json({ message: 'Failed to fetch todos' });
      }
      res.json(results);
  });
});

// API to Add Todo
app.post('/api/todos', (req, res) => {
  const { t_event, dueDate, color } = req.body;
    con.query(
      'INSERT INTO todos (t_event, dueDate, color) VALUES (?, ?, ?)',
      [t_event, dueDate, color],
      (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).json({ message: 'Failed to add todo' });
        }
      res.json({ id: results.insertId, t_event, dueDate, color });
    }
  );
});

// API to Delete Todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  con.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).json({ message: 'Failed to delete todo' });
    }
    res.json({ message: 'Todo deleted' });
  });
});

// API to Update Todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { t_event, dueDate} = req.body; 
  con.query(
    'UPDATE todos SET t_event = ?, dueDate = ?  WHERE id = ?',
    [t_event, dueDate, id],
    (err) => {
      if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).json({ message: 'Failed to update todo' });
      }
      res.json({ message: 'Todo updated' });
    }
  );
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
