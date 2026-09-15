# PixelMind AI (Dream Canvas)

An AI image generation web app that turns text prompts into images. Users sign in, spend credits to generate artwork, browse their gallery, and top up credits through a payment flow. The frontend is a React single-page app, and the backend runs on Supabase with authentication, a database, and edge functions.

## Features

- Email and Google authentication with protected routes
- Text-to-image generation with selectable style presets and aspect ratios
- Credit system that tracks and deducts usage per generation
- Personal gallery of previously generated images
- Credit purchase flow with payment creation and webhook handling
- Responsive interface built on the shadcn-ui component library

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 with TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS and shadcn-ui |
| Routing | React Router |
| Data fetching | TanStack Query |
| Backend | Supabase (Auth, Postgres, Edge Functions) |
| Validation | Zod and React Hook Form |

## Project Structure

```
project25/
├── src/
│   ├── components/      Shared UI and shadcn components
│   ├── contexts/        Authentication context
│   ├── hooks/           Reusable hooks
│   ├── integrations/    Supabase client and types
│   ├── pages/           Route-level pages
│   └── main.tsx         Application entry point
├── supabase/
│   ├── functions/       Edge functions for images, credits, and payments
│   └── migrations/      Database schema migrations
├── public/              Static assets
└── index.html
```

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/auth`, `/login`, `/signup` | Public | Sign in and registration |
| `/dashboard` | Protected | User dashboard |
| `/generate` | Protected | Generate images from prompts |
| `/my-images` | Protected | Personal image gallery |
| `/buy-credits` | Protected | Purchase additional credits |

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`.

## Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Author

Created by [Kumar44developer](https://github.com/Kumar44developer).
