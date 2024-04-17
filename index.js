const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Connect to the Vercel Postgres database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CRUD operations
app.get('/data', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM data');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/data', async (req, res) => {
  try {
    const { state, districts } = req.body;
    const query = 'INSERT INTO data (state, districts) VALUES ($1, $2) RETURNING *';
    const values = [state, districts];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state, districts } = req.body;
    const query = 'UPDATE data SET state = $1, districts = $2 WHERE id = $3 RETURNING *';
    const values = [state, districts, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM data WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});