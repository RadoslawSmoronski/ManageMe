🌐 [English](README.md) | 🇵🇱 [Polski](README-pl.md)

# ManageMe - Frontend

Frontend aplikacji do zarzadzania praca zespolowa w formie Kanbana (Projects, Stories, Tasks).
Zbudowany w React, TypeScript i Vite.

---

## Spis tresci

1. [O projekcie](#o-projekcie)
2. [Technologie](#technologie)
3. [Funkcje](#funkcje)
4. [Aktualny zakres](#aktualny-zakres)
5. [Struktura rozwiazania](#struktura-rozwiazania)
6. [Konfiguracja](#konfiguracja)
7. [Jak uruchomic lokalnie](#jak-uruchomic-lokalnie)
8. [Dostepne skrypty](#dostepne-skrypty)
9. [Mock API](#mock-api)
10. [Status projektu](#status-projektu)

---

## O projekcie

**ManageMe** to frontend skoncentrowany na przeplywie pracy projektowej w ukladzie Kanban.

Mozesz:

- tworzyc i zarzadzac projektami,
- tworzyc i zarzadzac stories w projektach,
- tworzyc i zarzadzac taskami w stories,
- przenosic taski miedzy kolumnami metoda drag & drop,
- przypisywac taski do uzytkownikow z danych mock.

Na tym etapie dane sa mockowane przez `json-server` z pliku `db.json`.

---

## Technologie

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Bootstrap 5 + React-Bootstrap + Bootstrap Icons
- `@hello-pangea/dnd`
- SweetAlert2
- `json-server`

---

## Funkcje

- CRUD projektow.
- CRUD stories.
- CRUD taskow.
- Tablica Kanban dla taskow (`Planned`, `Doing`, `Completed`).
- Drag & drop do porzadkowania taskow.
- Tryb motywu: system / jasny / ciemny.

---

## Aktualny zakres

Aktualnie zaimplementowane:

- `projects`
- `stories`
- `tasks`
- mockowane `users` do przypisan i kontekstu

Jeszcze niezaimplementowane:

- prawdziwe konta uzytkownikow,
- autoryzacja/uwierzytelnianie,
- integracja z realnym backendem API (obecnie tylko mock).

Planowany backend: lekkie RESTful Minimal Web API zbudowane w .NET.

---

## Struktura rozwiazania

Glowne katalogi:

- `src/components` - komponenty UI i domenowe.
- `src/pages` - strony routingu.
- `src/context` - zarzadzanie stanem przez React Context.
- `src/services` - warstwa komunikacji HTTP.
- `src/types` - modele TypeScript.
- `src/config` - konfiguracja runtime (API URL).
- `db.json` - mock baza danych dla `json-server`.

---

## Konfiguracja

Zmienna srodowiskowa:

```env
VITE_API_URL=http://localhost:3001
```

Jesli nie jest ustawiona, aplikacja domyslnie uzywa `http://localhost:3001`.

---

## Jak uruchomic lokalnie

1. Zainstaluj zaleznosci:

```bash
npm install
```

2. Uruchom mock API:

```bash
npm run server
```

3. Uruchom frontend:

```bash
npm run dev
```

---

## Dostepne skrypty

- `npm run dev` - uruchamia Vite dev server.
- `npm run build` - buduje wersje produkcyjna.
- `npm run preview` - podglad buildu produkcyjnego.
- `npm run server` - uruchamia `json-server` na porcie `3001`.

---

## Mock API

Aplikacja obecnie korzysta z `json-server` i kolekcji:

- `users`
- `projects`
- `stories`
- `tasks`

Base URL:

```text
http://localhost:3001
```

---

## Status projektu

Projekt jest w aktywnym rozwoju.

Obecny kierunek:

- dopracowanie UX i spojnosci flow,
- utrzymanie czystych modeli TypeScript i contextow,
- przygotowanie pod przyszla integracje z prawdziwym backendem.
