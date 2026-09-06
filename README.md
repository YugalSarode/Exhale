# 🚭 Virtual Smoke

**Virtual Smoke** is a web application designed to help people manage smoking cravings through guided breathing exercises and craving tracking.

Instead of immediately reaching for a cigarette, users can use the app to pause, complete a short breathing exercise, and record what triggered the craving and how intense it was.

## 🌐 Live Demo

**Live Project:** https://exhale-liart.vercel.app/



## ✨ Features

### 🫁 Guided Breathing

When a craving starts, users can begin a guided **box-breathing exercise**:

* Inhale
* Hold
* Exhale
* Hold
* Repeat for several cycles

The exercise provides a simple way to pause and focus during a craving.

### 📝 Craving Check-In

After completing the breathing exercise, users can record:

* What triggered the craving
* Craving intensity
* When the craving occurred
* Whether they successfully resisted the craving

### 📊 Personal Dashboard

The dashboard provides real-time statistics based on the user's recorded data, including:

* Days smoke-free
* Cravings survived
* Money saved
* Craving history

### 🔐 User Authentication

Users can create an account and securely access their personal data using email-based authentication.

### 🛡️ Data Security

The application uses **Supabase Row Level Security (RLS)** to ensure users can only access their own data.

## 🛠️ Tech Stack

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| React           | Frontend framework          |
| Vite            | Development and build tool  |
| Tailwind CSS v4 | Styling and UI              |
| Supabase        | Authentication and database |
| PostgreSQL      | Data storage                |

## 📁 Project Structure

```text
virtual-smoke/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── schema.sql
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

Follow these steps to run Virtual Smoke locally.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd virtual-smoke
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Supabase Project

Create a project on [Supabase](https://supabase.com).

### 4. Configure the Database

Open the **SQL Editor** in your Supabase dashboard and run the contents of:

```text
schema.sql
```

This creates the required database tables and security policies.

### 5. Enable Email Authentication

In Supabase, go to:

```text
Authentication → Providers → Email
```

Make sure **Email authentication** is enabled.

### 6. Configure Environment Variables

Create a `.env` file based on `.env.example`.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

### 7. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## ☁️ Deployment

The application can be deployed using platforms such as:

* Vercel
* Netlify
* Cloudflare Pages

After deployment, replace the **Live Project** URL at the top of this README with your actual deployed URL.

## 📌 Current Status

**Early-stage prototype**

The core craving-support workflow is implemented, including:

* Guided breathing exercise
* Craving check-in
* Craving tracking
* Dashboard statistics
* User authentication
* Supabase database integration
* Row Level Security

### Planned Improvements

* Complete onboarding process
* Custom quit date
* Cigarettes smoked per day
* Custom cigarette price
* More accurate money-saved calculations
* Craving pattern analysis
* Trigger-based statistics
* Weekly and monthly progress reports
* Improved mobile experience
* Achievement and milestone system

## 🎯 Project Goal

The goal of Virtual Smoke is to provide a simple, accessible tool that helps users **pause during a smoking craving, practice a short breathing exercise, and build awareness of their craving patterns over time.**

## ⚠️ Disclaimer

Virtual Smoke is a **support and tracking tool, not a medical treatment or substitute for professional medical advice**.

People trying to quit smoking should consider speaking with a qualified healthcare professional or using an appropriate smoking-cessation service.

## 📄 License

This project is intended for educational and development purposes.
