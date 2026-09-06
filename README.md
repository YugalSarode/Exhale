\# Virtual Smoke



A web app that helps people get through smoking cravings with guided breathing and craving tracking, instead of reaching for a cigarette.



\## How it works



\- \*\*I have a craving\*\* — starts a guided box-breathing exercise (inhale, hold, exhale, hold, repeated over a few cycles) timed to help the craving pass.

\- \*\*Check-in\*\* — after breathing, log what triggered the craving and how intense it was.

\- \*\*Dashboard\*\* — tracks days smoke-free, money saved, and cravings survived, based on real data rather than guesses.



\## Tech stack



\- React + Vite

\- Tailwind CSS v4

\- Supabase (Postgres database, email-based authentication, row-level security)



\## Getting started



1\. Clone this repo and run `npm install`

2\. Create a project at \[supabase.com](https://supabase.com)

3\. In the Supabase SQL editor, run `schema.sql` from this repo

4\. Copy `.env.example` to `.env` and fill in your Supabase project URL and anon key

5\. In Supabase, under Authentication → Providers, make sure Email is enabled

6\. Run `npm run dev` and open the printed local URL



\## Project structure

\## Status



This is an early-stage prototype. Not yet handling onboarding (quit date, cigarette cost) beyond default values, and doesn't yet surface craving patterns over time.



\## A note on scope



This app is a support tool, not a medical treatment. If you're trying to quit smoking, consider also talking to a doctor or calling a quitline

