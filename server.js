const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data (lost on restart, on purpose)
let movies = [];
let nextId = 1;

// Returns an error message (Swedish) or null if the data is valid
function validate(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title === '') return 'Titel får inte vara tom';
  if (title.length > 100) return 'Titel får vara max 100 tecken';

  const maxYear = new Date().getFullYear() + 1;
  if (!Number.isInteger(body.year) || body.year < 1888 || body.year > maxYear) {
    return 'Ange ett giltigt år';
  }

  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return 'Betyg måste vara mellan 1 och 5';
  }

  return null;
}

function toMovie(id, body) {
  return {
    id,
    title: body.title.trim(),
    year: body.year,
    rating: body.rating,
    watched: body.watched === true,
  };
}

app.get('/api/movies', (req, res) => {
  res.status(200).json(movies);
});

app.post('/api/movies', (req, res) => {
  const body = req.body || {};
  const error = validate(body);
  if (error) return res.status(400).json({ error });

  const movie = toMovie(nextId++, body);
  movies.push(movie);
  res.status(201).json(movie);
});

app.put('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = movies.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Filmen hittades inte' });

  const body = req.body || {};
  const error = validate(body);
  if (error) return res.status(400).json({ error });

  movies[index] = toMovie(id, body);
  res.status(200).json(movies[index]);
});

app.delete('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = movies.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Filmen hittades inte' });

  movies.splice(index, 1);
  res.status(204).end();
});

// Only for tests – must never exist in production
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/test/reset', (req, res) => {
    movies = [];
    nextId = 1;
    res.status(204).end();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});