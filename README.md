# Boro Launch Pad

Website for **Boro Launch Pad**, a small-event venue near Murfreesboro, Tennessee built for workshops, classes, pop-ups, celebrations and new ideas.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Deploy on Railway

This repository is Railway-ready. Create a Railway project from this GitHub repository and Railway will use `railway.json` plus the `npm start` script. No build step or environment variables are required for the current version.

> The inquiry endpoint currently returns an on-screen confirmation but does not persist or email submissions. Connect an email provider or database before using it for production leads.

## Editing events

Upcoming event cards currently live in `public/app.js`. Venue copy and page sections are in `public/index.html`, with styling in `public/styles.css`.
