# Testkonventioner – Playwright och CI

## Locators – i denna prioritetsordning

1. `page.getByRole('button', { name: 'Lägg till film' })` – hur användare och skärmläsare uppfattar sidan
2. `page.getByLabel('Titel')` – formulärfält
3. `page.getByText('Inga filmer ännu')` – statisk text
4. `page.getByTestId(...)` – bara om inget ovan fungerar (lägg då till `data-testid` och motivera varför)
5. CSS/XPath – undvik

Hämta en specifik rad i listan genom att filtrera:

```ts
const list = page.getByRole('list', { name: 'Filmer' });
const row = list.getByRole('listitem').filter({ hasText: 'Inception' });
await row.getByRole('button', { name: 'Ta bort Inception' }).click();
```

## Assertions

Använd *web-first assertions* – de väntar och försöker igen automatiskt:

```ts
await expect(page.getByText('Inception (2010)')).toBeVisible();
await expect(page.getByRole('alert')).toHaveText('Titel får inte vara tom');
await expect(page.getByRole('listitem')).toHaveCount(2);
await expect(page.getByLabel('Titel')).toHaveValue('');
```

Undvik `expect(await locator.isVisible()).toBe(true)` – den väntar inte och ger instabila tester.

## Förbjudet

- `page.waitForTimeout(...)` – fasta väntetider ger långsamma och instabila tester. Playwright väntar automatiskt.
- `test.only` i committad kod – CI är konfigurerad med `forbidOnly: !!process.env.CI` och failar då.
- Tester som beror på varandra eller på ordningen de körs i.

## Testisolering

Varje test börjar från ett rent läge:

```ts
test.beforeEach(async ({ page, request }) => {
  await request.post('/api/test/reset');
  await page.goto('/');
});
```

Testerna körs parallellt mot **samma** server och datan finns i minnet. Om parallella tester stör varandra:
sätt `workers: 1` i `playwright.config.ts` (eller `test.describe.configure({ mode: 'serial' })`) och diskutera varför
det händer – det är ett bra lärtillfälle om delat tillstånd.

## Namngivning

- Filer: `tests/<område>.spec.ts`
- Testnamn på svenska, beskriver beteende: `test('visar felmeddelande när titeln är tom', ...)`
- Gruppera med `test.describe('Lägga till film', ...)`

## När ett test failar

1. Läs felmeddelandet – Playwright visar förväntat vs. faktiskt värde och vilken locator som användes
2. `npx playwright show-report` → klicka på testet
3. Öppna **trace** – se varje steg, DOM-snapshot, nätverk och konsol
4. Kör ensamt i debug-läge: `npx playwright test -g "<testnamn>" --debug`

## CI (GitHub Actions)

- Workflow: `.github/workflows/playwright.yml`
- Körs vid `push` och `pull_request` mot `main`
- Använder `npm ci` (exakt från `package-lock.json`, snabbare och reproducerbart) – inte `npm install`
- `npx playwright install --with-deps` installerar webbläsare + systemberoenden på runnern
- I CI är `retries: 2` och `trace: 'on-first-retry'` – en trace sparas när ett test failar första gången
- HTML-rapporten laddas upp som artifact (`playwright-report`) – ladda ner från körningens sida i Actions-fliken
- `main` är skyddad: en PR kan inte mergas om Playwright-jobbet är rött
