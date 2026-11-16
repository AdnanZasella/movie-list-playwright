const form = document.getElementById('movie-form');
const titleInput = document.getElementById('title');
const yearInput = document.getElementById('year');
const ratingSelect = document.getElementById('rating');
const watchedInput = document.getElementById('watched');
const errorBox = document.getElementById('error');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const listEl = document.getElementById('movie-list');

let movies = [];
let editingId = null; // only one row can be edited at a time

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

// Sends a request. Returns { ok, data } where data is the parsed JSON (if any).
async function api(url, options) {
  const res = await fetch(url, options);
  const data = res.status === 204 ? null : await res.json();
  return { ok: res.ok, data };
}

function jsonRequest(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

async function loadMovies() {
  const { data } = await api('/api/movies');
  movies = data;
  render();
}

// --- Rendering ---------------------------------------------------------

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  node.append(...children);
  return node;
}

function button(text, ariaLabel, onClick) {
  const b = el('button', { type: 'button', textContent: text });
  if (ariaLabel) b.setAttribute('aria-label', ariaLabel);
  b.addEventListener('click', onClick);
  return b;
}

function renderViewRow(movie) {
  const summary =
    `${movie.title} (${movie.year}) – Betyg: ${movie.rating}/5 – ` +
    (movie.watched ? 'Sedd' : 'Ej sedd');

  const actions = el('div', { className: 'actions' }, [
    button('Redigera', `Redigera ${movie.title}`, () => {
      editingId = movie.id;
      render();
    }),
    button('Ta bort', `Ta bort ${movie.title}`, () => deleteMovie(movie.id)),
  ]);

  return el('li', {}, [el('span', { textContent: summary }), actions]);
}

function renderEditRow(movie) {
  const id = movie.id;

  const title = el('input', { id: `edit-title-${id}`, type: 'text', value: movie.title });
  const year = el('input', { id: `edit-year-${id}`, type: 'number', value: movie.year });
  const rating = el('select', { id: `edit-rating-${id}` });
  for (let r = 1; r <= 5; r++) {
    rating.append(el('option', { value: String(r), textContent: String(r) }));
  }
  rating.value = String(movie.rating);
  const watched = el('input', {
    id: `edit-watched-${id}`,
    type: 'checkbox',
    checked: movie.watched,
  });

  const label = (text, forId) => el('label', { htmlFor: forId, textContent: text });

  const fields = el('div', { className: 'edit-fields' }, [
    label('Redigera titel', title.id), title,
    label('Redigera år', year.id), year,
    label('Redigera betyg', rating.id), rating,
    label('Redigera sedd', watched.id), watched,
  ]);

  const actions = el('div', { className: 'actions' }, [
    button('Spara', null, () =>
      saveMovie(id, {
        title: title.value,
        year: year.valueAsNumber,
        rating: Number(rating.value),
        watched: watched.checked,
      })
    ),
    button('Avbryt', null, () => {
      editingId = null;
      render();
    }),
  ]);

  return el('li', {}, [fields, actions]);
}

function render() {
  countEl.textContent = `Antal filmer: ${movies.length}`;
  emptyEl.hidden = movies.length > 0;

  listEl.replaceChildren(
    ...movies.map((m) => (m.id === editingId ? renderEditRow(m) : renderViewRow(m)))
  );
}

// --- Actions -----------------------------------------------------------

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { ok, data } = await api(
    '/api/movies',
    jsonRequest('POST', {
      title: titleInput.value,
      year: yearInput.valueAsNumber, // NaN becomes null in JSON -> server rejects it
      rating: Number(ratingSelect.value),
      watched: watchedInput.checked,
    })
  );

  if (!ok) return showError(data.error);

  clearError();
  form.reset();
  await loadMovies();
});

async function saveMovie(id, body) {
  const { ok, data } = await api(`/api/movies/${id}`, jsonRequest('PUT', body));
  if (!ok) return showError(data.error);

  clearError();
  editingId = null;
  await loadMovies();
}

async function deleteMovie(id) {
  const { ok, data } = await api(`/api/movies/${id}`, { method: 'DELETE' });
  if (!ok) return showError(data.error);

  clearError();
  if (editingId === id) editingId = null;
  await loadMovies();
}

loadMovies();
