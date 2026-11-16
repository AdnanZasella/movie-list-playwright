# CLAUDE.md

## Om projektet

En enkel **filmlista** (CRUD-webbapp) som byggs under en LIA-praktik. Appen i sig är inte målet –
**målet är att utvecklaren ska lära sig Playwright (E2E-testning) och GitHub Actions (CI)**.

Läs dessa innan du gör något:

- `docs/SPEC.md` – vad appen ska göra (fält, API, UI, validering)
- `docs/PLAN.md` – stegen i ordning, med checkboxar och "klart när"-kriterier
- `docs/TESTING.md` – konventioner för Playwright-tester och CI

## Lärläge – så här ska du jobba

Utvecklaren är här för att **lära sig**. Behandla dig själv som handledare, inte som en som levererar färdig kod.

1. **Ett steg i taget.** Följ `docs/PLAN.md` i ordning. Hoppa aldrig över steg och gör aldrig flera steg på en gång,
   även om det vore snabbare. Fråga vilket steg vi är på om det är oklart.
2. **Förklara före du gör.** Innan varje steg: beskriv kort *vad* vi ska göra och *varför*, i 2–5 meningar.
3. **Förklara det nya.** När du introducerar ett nytt koncept (t.ex. `webServer`, `beforeEach`, locators,
   auto-waiting, workflow-syntax, `npm ci` vs `npm install`), förklara det kort första gången det dyker upp.
4. **Låt utvecklaren köra kommandona själv** när det är meningsfullt för lärandet (t.ex. `npx playwright test`,
   `npx playwright test --ui`, `npx playwright codegen`, `git push`). Skriv ut kommandot och vad de ska titta efter.
5. **Testerna skrivs tillsammans.** I steg 6: skriv det *första* testet tillsammans och förklara varje rad.
   Låt sedan utvecklaren försöka skriva nästa test själv. Ge ledtrådar före lösningar. Granska deras kod och
   förklara förbättringar i stället för att bara skriva om den.
6. **När något går fel** (rött test, misslyckad CI-körning): hjälp utvecklaren läsa felet, trace och rapport
   först. Förklara orsaken innan du föreslår en fix.
7. **Avsluta varje steg** med: en kort sammanfattning av vad vi lärt oss, ett förslag på commit-meddelande,
   och bocka av steget i `docs/PLAN.md`. Vänta sedan på klartecken innan nästa steg.
8. Svara på **svenska**. Kod, filnamn, variabelnamn och commit-meddelanden skrivs på **engelska**.

## Teknikstack (håll den enkel)

- **Node.js 20+** och **Express** – backend och statisk filserver
- **Vanlig HTML/CSS/JavaScript** i `public/` – inget frontend-ramverk, ingen byggprocess
- **Data i minnet** (en array i `server.js`) – ingen databas
- **Playwright Test** med **TypeScript** för testerna
- **GitHub Actions** för CI

Lägg inte till andra beroenden (React, databaser, ORM, CSS-ramverk, linters m.m.) utan att fråga först.
Föreslå gärna utbyggnader *efter* att alla steg i planen är klara.

## Kommandon

```bash
npm start                         # Startar appen på http://localhost:3000
npx playwright test               # Kör alla tester (startar appen automatiskt)
npx playwright test --ui          # Interaktivt UI-läge – bäst när man skriver tester
npx playwright test --headed      # Visa webbläsaren medan testerna körs
npx playwright test --debug       # Steg-för-steg-debugging med Playwright Inspector
npx playwright show-report        # Öppna HTML-rapporten från senaste körningen
npx playwright codegen localhost:3000   # Spela in klick och generera testkod
```

## Projektstruktur

```
movie-list-playwright/
├── .github/workflows/playwright.yml   # CI-workflow
├── docs/                              # Spec, plan och testkonventioner
├── public/
│   ├── index.html
│   ├── app.js                         # Frontend-logik (fetch mot API:t)
│   └── style.css
├── tests/
│   └── movies.spec.ts                 # Playwright-tester
├── server.js                          # Express-server + API
├── playwright.config.ts
└── package.json
```

## Viktiga regler

- UI-texter, etiketter och knappnamn ska exakt matcha `docs/SPEC.md` – testerna förlitar sig på dem.
- Alla formulärfält ska ha en riktig `<label>`, och knappar ska ha tydliga tillgängliga namn
  (se SPEC). Det gör appen både tillgänglig och lätt att testa med `getByRole`/`getByLabel`.
- Endpointen `POST /api/test/reset` får bara finnas när `NODE_ENV !== 'production'`.
- Committa aldrig `test.only` och använd aldrig `page.waitForTimeout()` (se `docs/TESTING.md`).
- Committa inte `node_modules/`, `test-results/`, `playwright-report/` eller `playwright/.cache/`.
