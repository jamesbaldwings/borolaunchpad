# Boro Launch Pad

Boro Launch Pad is a small-event venue website for Murfreesboro, Tennessee. It includes public event listings, host spotlights, venue/event ideas, registration, contact and booking-request forms, and an admin area.

## Railway deployment

1. Create a Railway project from this GitHub repository.
2. Add a PostgreSQL service.
3. Set `DATABASE_URL` from Railway PostgreSQL.
4. Set `NEXTAUTH_SECRET` to a long random value.
5. Set `ADMIN_PASSWORD` to the desired admin password.
6. Set `NEXTAUTH_URL` to the Railway public domain after the first deployment, then redeploy.

`railway.json` runs Prisma generation and the Next.js build, then applies the Prisma schema before starting the app.

## Local development

Copy `.env.example` to `.env`, configure PostgreSQL, then run:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Optional seed data:

```bash
npm run seed
```
