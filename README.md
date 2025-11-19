# Beboerkommunikation og dokumentation

Dette repo indeholder en færdig startapplikation til kommunikation mellem beboere, rådgivere og byggeledere i forbindelse med renoveringsprojekter. Løsningen består af en Node/Express backend og en React/Vite frontend.

## Forudsætninger

- Node.js 20+
- pnpm/yarn/npm (eksemplerne her bruger npm)
- Docker + docker-compose til PostgreSQL

## Miljøfiler

1. Kopiér `server/.env.example` til `server/.env` og justér efter behov (database-URL og JWT-secret).
2. Kopiér `client/.env.example` til `client/.env` for lokal udvikling, så frontend rammer `http://localhost:4000/api`. I produktion/Vercel kan feltet udelades, da klienten som udgangspunkt kalder `/api`.

## Database

Start databasen med docker-compose i repo-roden:

```bash
docker-compose up -d
```

Kør derefter Prisma-migreringer fra `/server`:

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
```

## Seed-data

Fra `/server` kan du fylde databasen med eksempler:

```bash
npm run seed
```

Dette opretter:

- Ejendom, afdeling og lejemål
- Byggeleder: `byggeleder@example.dk` / `Test1234!`
- Beboer: `beboer@example.dk` / `Test1234!`
- Rådgiver: `raadgiver@example.dk` / `Test1234!`
- Eksempeldokumenter

## Udviklingsservere

### Backend

```bash
cd server
npm run dev
```

Backend kører nu på `http://localhost:4000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend kører på `http://localhost:5173`. Husk at `VITE_API_BASE_URL` i `.env` skal pege på den kørende backend, typisk `http://localhost:4000/api`.

## Loginroller

| Rolle        | E-mail                   | Adgangskode |
| ------------ | ------------------------ | ----------- |
| Byggeleder   | byggeleder@example.dk    | Test1234!   |
| Beboer       | beboer@example.dk        | Test1234!   |
| Rådgiver     | raadgiver@example.dk     | Test1234!   |

## Produktion

- Kør `npm run build` i både `/server` og `/client` for at producere build-artifakter, hvis du selv vil hoste backend/frontend.
- Host backend og frontend efter behov (fx via container eller separate tjenester).

## Udrulning på Vercel

Repoet er gjort klar til Vercel via `vercel.json`, som opsætter:

- en statisk build af `/client` med Vite (`@vercel/static-build`)
- en serverless funktion der bruger Express-appen fra `/server/src/vercel.ts`

Fremgangsmåde:

1. Forbind GitHub-repoet til Vercel.
2. Under **Project Settings → Environment Variables** opret variablerne:
   - `DATABASE_URL` (peg på en tilgængelig Postgres, fx managed DB)
   - `JWT_SECRET`
   - `VITE_API_BASE_URL` med værdien `/api` (så klienten rammer den serverless backend).
3. Deploy projektet. Vercel læser `vercel.json`, bygger frontend og uploader Express-backenden som serverless API, så hele appen svarer på samme domæne.
4. Husk at køre migreringer/seed manuelt på databasen via lokale scripts eller en CI-job, da Vercel ikke kører `prisma migrate` automatisk.
