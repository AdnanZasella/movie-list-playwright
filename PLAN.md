# Plan – steg för steg

Gör stegen i ordning. Bocka av `[x]` när "Klart när" är uppfyllt. Committa efter varje steg.

---

## Steg 1 – Repo och projekt

**Lärmål:** grundläggande projektuppsättning, `.gitignore`, `package.json`-scripts.

- [x] Repo `movie-list-playwright` skapat på GitHub (README + Node-`.gitignore`) och klonat
- [x] `npm init -y` och `npm install express`
- [x] Script `"start": "node server.js"` i `package.json`
- [x] Mapparna `public/` och `tests/` skapade

**Klart när:** första commiten är pushad och `node_modules/` inte syns på GitHub.

---

## Steg 2 – Backend-API

**Lärmål:** Express, REST, statuskoder, validering på servern.

- [x] `server.js` serverar `public/` statiskt och har alla endpoints enligt `docs/SPEC.md`
- [x] Validering med exakta felmeddelanden från SPEC
- [x] `POST /api/test/reset` som bara finns när `NODE_ENV !== 'production'`

**Klart när:** utvecklaren själv har testat API:t med `curl` (eller REST-klient) – minst en lyckad POST,
en POST med tom titel (400), en GET, en DELETE och en reset.

---

## Steg 3 – Frontend

**Lärmål:** `fetch`, DOM-uppdatering, tillgängliga labels och knappnamn (och varför det hjälper testning).

- [x] `index.html`, `app.js`, `style.css` enligt SPEC (exakta texter och labels!)
- [x] Lägga till, visa, redigera, ta bort fungerar i webbläsaren
- [x] Felmeddelande visas i `role="alert"`
- [x] Tom lista visar "Inga filmer ännu", räknaren visar rätt antal

**Klart när:** utvecklaren manuellt har gått igenom hela CRUD-flödet i webbläsaren.

---

## Steg 4 – Installera och konfigurera Playwright

**Lärmål:** vad Playwright installerar, `playwright.config.ts`, `webServer`, `baseURL`, projekt/webbläsare.

- [x] `npm init playwright@latest` (TypeScript, mapp `tests`, **ja** till GitHub Actions, **ja** till att installera webbläsare)
- [x] Ta bort exempeltesterna (`tests/example.spec.ts`, ev. `tests-examples/`)
- [x] Konfigurera i `playwright.config.ts`:
  - `webServer` som kör `npm start` mot `http://localhost:3000`, `reuseExistingServer: !process.env.CI`
  - `use.baseURL: 'http://localhost:3000'`
  - `use.trace: 'on-first-retry'`
  - Behåll projekten chromium, firefox, webkit
- [x] Ett första "rökttest": sidan laddas och rubriken "Filmlista" syns
- [x] Kontrollera att `.gitignore` innehåller `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`

**Klart när:** `npx playwright test` är grönt i Chromium lokalt (Firefox/WebKit blockeras av Smart App Control på Windows – de körs i CI i Steg 7), och utvecklaren har öppnat
`npx playwright show-report` och `npx playwright test --ui` och sett hur de fungerar.

---

## Steg 5 – Utforska med codegen

**Lärmål:** hur Playwright "ser" sidan, locators, varför `getByRole` är att föredra.

- [x] Starta appen och kör `npx playwright codegen localhost:3000`
- [x] Spela in: lägga till en film
- [x] Diskutera den genererade koden: vilka locators valdes och varför? Vad saknas (assertions!)?

**Klart när:** utvecklaren kan förklara skillnaden mellan `getByRole`, `getByLabel`, `getByText` och CSS-selektorer.
(Ingen kod behöver committas i detta steg.)

---

## Steg 6 – Skriv testerna

**Lärmål:** teststruktur, `beforeEach`, testisolering, assertions, auto-waiting, `request`-fixturen.
**Arbetssätt:** första testet skrivs tillsammans – resten försöker utvecklaren skriva själv.

Allt i `tests/movies.spec.ts`. Använd `test.describe` och en `beforeEach` som anropar reset och går till `/`.

- [ ] **Tom lista:** visar "Inga filmer ännu" och "Antal filmer: 0" *(skrivs tillsammans)*
- [ ] **Skapa:** lägg till en film → syns i listan med rätt text, formuläret töms, räknaren visar 1
- [ ] **Validering:** tom titel → alert "Titel får inte vara tom", ingen film tillagd
- [ ] **Validering:** ogiltigt år → alert "Ange ett giltigt år"
- [ ] **Redigera:** ändra titel och betyg → raden visar nya värden
- [ ] **Avbryt redigering:** ändra något och tryck Avbryt → ursprungliga värden kvar
- [ ] **Ta bort:** ta bort en av två filmer → rätt film borta, den andra kvar, räknaren visar 1
- [ ] **Persistens:** lägg till film, ladda om sidan (`page.reload()`) → filmen finns kvar
- [ ] **Testdata via API (bonus):** skapa filmer med `request.post('/api/movies', ...)` i stället för via UI, och förklara när det är bättre

**Klart när:** alla tester är gröna i alla webbläsare, utan `waitForTimeout`, och varje test klarar sig
om det körs ensamt (`npx playwright test -g "<testnamn>"`).

---

## Steg 7 – GitHub Actions

**Lärmål:** workflow-syntax (`on`, `jobs`, `steps`, `uses`, `run`), `npm ci`, artifacts.

- [ ] Granska `.github/workflows/playwright.yml` som init skapade. Gå igenom varje rad.
- [ ] Säkerställ: körs på `push` och `pull_request` mot `main`, Node LTS, `npm ci`,
      `npx playwright install --with-deps`, `npx playwright test`, laddar upp `playwright-report/` som artifact
- [ ] Pusha och se körningen i **Actions**-fliken
- [ ] Ladda ner rapport-artifacten och öppna den

**Klart när:** en grön körning syns i Actions och utvecklaren har öppnat den nedladdade rapporten.

---

## Steg 8 – Gör CI till en grind

**Lärmål:** branch protection, pull request-flöde, hur CI stoppar dålig kod.

- [ ] På GitHub: **Settings → Branches** (eller **Rules → Rulesets**) → regel för `main`:
      kräv pull request och kräv att Playwright-jobbet är grönt
- [ ] **Övning – ha sönder något med flit:** skapa branch `break-something`, ändra t.ex. knapptexten
      "Lägg till film" till "Spara film" i `index.html`, pusha och öppna en PR
- [ ] Se testet gå rött och mergen blockeras. Ladda ner rapporten, öppna trace för det röda testet och hitta orsaken
- [ ] Fixa (återställ), se det gå grönt, merga

**Klart när:** utvecklaren har sett en PR blockeras av ett rött test och sedan fått den grön och mergad.

---

## Utbyggnader (valfritt, efter steg 8)

Välj en eller flera – lägg till funktionen **och** testerna för den:

- Filter "Visa endast osedda"
- Sökning på titel
- Bekräftelsedialog vid borttagning (lär dig `page.on('dialog')`)
- Visuell regressionstestning med `expect(page).toHaveScreenshot()`
- API-tester med Playwrights `request`-fixtur i en egen fil `tests/api.spec.ts`
- Page Object Model – flytta locators till en klass `tests/pages/MovieListPage.ts`
- Sharding / parallella jobb i GitHub Actions
- Byt minnes-arrayen mot SQLite
