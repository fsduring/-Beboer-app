# Beboerkommunikation og dokumentation

Dette repo indeholder en færdig startapplikation til kommunikation mellem beboere, rådgivere og byggeledere i forbindelse med renoveringsprojekter. Løsningen består af en Node/Express backend og en React/Vite frontend.

## Forudsætninger

- Node.js 20+
- pnpm/yarn/npm (eksemplerne her bruger npm)
- Docker + docker-compose til PostgreSQL

## Miljøfiler

1. Kopiér `server/.env.example` til `server/.env` og justér efter behov (database-URL og JWT-secret).
2. Kopiér `client/.env.example` til `client/.env` hvis du vil ændre API-basen.

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

Frontend kører på `http://localhost:5173` og proxier API-kald til backend.

## Loginroller

| Rolle        | E-mail                   | Adgangskode |
| ------------ | ------------------------ | ----------- |
| Byggeleder   | byggeleder@example.dk    | Test1234!   |
| Beboer       | beboer@example.dk        | Test1234!   |
| Rådgiver     | raadgiver@example.dk     | Test1234!   |

## Produktion

- Kør `npm run build` i både `/server` og `/client` for at producere build-artifakter.
- Host backend og frontend efter behov (fx via container eller separate tjenester).
