# Specifikation – Filmlista

En enkel webbapp där man kan lägga till, visa, redigera och ta bort filmer.

## Datamodell

En film:

| Fält      | Typ     | Regler                                              |
|-----------|---------|-----------------------------------------------------|
| `id`      | number  | Sätts av servern, ökar med 1 för varje ny film      |
| `title`   | string  | Obligatorisk. Trimmas. Får inte vara tom efter trim. Max 100 tecken |
| `year`    | number  | Obligatoriskt heltal mellan 1888 och innevarande år + 1 |
| `rating`  | number  | Obligatoriskt heltal 1–5                            |
| `watched` | boolean | Valfritt, standard `false`                          |

Data sparas i en array i minnet i `server.js`. Den försvinner när servern startas om – det är avsiktligt.

## API

Alla svar är JSON. Felsvar har formen `{ "error": "<meddelande på svenska>" }`.

| Metod  | Sökväg              | Body                 | Lyckat svar           | Fel                       |
|--------|---------------------|----------------------|-----------------------|---------------------------|
| GET    | `/api/movies`       | –                    | `200` + array av filmer | –                       |
| POST   | `/api/movies`       | `{title, year, rating, watched?}` | `201` + skapad film | `400` vid ogiltig data |
| PUT    | `/api/movies/:id`   | `{title, year, rating, watched}`  | `200` + uppdaterad film | `400` ogiltig data, `404` finns inte |
| DELETE | `/api/movies/:id`   | –                    | `204` (tom body)      | `404` finns inte          |
| POST   | `/api/test/reset`   | –                    | `204` – tömmer listan och nollställer id-räknaren | Finns ej om `NODE_ENV=production` |

### Felmeddelanden (exakta texter)

- Tom titel: `Titel får inte vara tom`
- Titel för lång: `Titel får vara max 100 tecken`
- Ogiltigt år: `Ange ett giltigt år`
- Ogiltigt betyg: `Betyg måste vara mellan 1 och 5`
- Film saknas: `Filmen hittades inte`

Validering görs **på servern**. Frontenden visar serverns felmeddelande. (HTML-attribut som `required`
ska *inte* användas på fälten – vi vill att valideringen går via servern så att den kan testas.)

Servern lyssnar på `process.env.PORT` eller `3000`.

## Gränssnitt

En sida (`public/index.html`) med:

### Rubrik

- `<h1>` med texten **Filmlista**

### Formulär för ny film

| Element        | Typ              | Tillgängligt namn (label/text) |
|----------------|------------------|--------------------------------|
| Titel          | `input type=text`   | `Titel`                     |
| År             | `input type=number` | `År`                        |
| Betyg          | `select` med 1–5    | `Betyg`                     |
| Sedd           | `input type=checkbox` | `Sedd`                    |
| Knapp          | `button type=submit` | `Lägg till film`           |

- Efter lyckad tilläggning töms formuläret och filmen syns i listan.
- Vid fel visas serverns felmeddelande i ett element med `role="alert"` ovanför formuläret.
  Meddelandet försvinner vid nästa lyckade åtgärd.

### Lista med filmer

- En `<ul>` med `aria-label="Filmer"`. Varje film är en `<li>`.
- Varje rad visar: titel, år inom parentes, betyg som text `Betyg: 4/5`, och `Sedd` eller `Ej sedd`.
  Exempel: `Inception (2010) – Betyg: 5/5 – Sedd`
- Varje rad har två knappar med tillgängliga namn som inkluderar titeln (via `aria-label`):
  - `Redigera <titel>` (synlig text: `Redigera`)
  - `Ta bort <titel>` (synlig text: `Ta bort`)
- Om listan är tom visas texten **Inga filmer ännu**.
- Ovanför listan visas en räknare: `Antal filmer: 3`.

### Redigera

- Klick på `Redigera` byter raden till ett redigeringsläge med samma fält som formuläret
  (labels: `Redigera titel`, `Redigera år`, `Redigera betyg`, `Redigera sedd`) och knapparna `Spara` och `Avbryt`.
- `Spara` skickar `PUT` och visar den uppdaterade raden. Vid fel visas felmeddelandet i alert-elementet.
- `Avbryt` återställer raden utan ändringar.
- Bara en rad kan redigeras åt gången.

### Ta bort

- Klick på `Ta bort` tar bort filmen direkt (ingen bekräftelsedialog – webbläsardialoger krånglar till testerna i början).

## Utanför scope (för nu)

Databas, inloggning, sortering, sökning, filtrering, frontend-ramverk. Kan bli utbyggnader i slutet – se `docs/PLAN.md`.
