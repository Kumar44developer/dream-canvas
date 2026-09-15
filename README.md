<div align="center">

# PixelMind AI

### Transforming Thoughts Into Images

An AI-powered, credit-based SaaS platform that turns text prompts into high-quality images. Sign up, pick a style, describe your vision, and generate artwork in seconds.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Pricing and Credits](#pricing-and-credits)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

PixelMind AI is a full-stack text-to-image generation product. The frontend is a fast single-page React application, and the backend runs entirely on Supabase using authentication, a Postgres database, and serverless edge functions. Image generation is powered by the FLUX.1-schnell model, generated images are hosted on Cloudinary, and credit purchases are processed through Stripe Checkout.

Every account starts with free credits, spends one credit per image, and can top up through three pricing tiers. The result is a complete, production-shaped SaaS foundation covering auth, metered usage, billing, and asset delivery.

## Key Features

- Text-to-image generation with positive and negative prompts
- Eleven curated style presets including Anime, Photorealistic, Cyberpunk, Fantasy, and Pixel Art
- Six aspect ratios spanning square, portrait, landscape, widescreen, and story formats
- Email and password plus Google OAuth authentication
- Metered credit system with per-generation deduction and live balance
- Three-tier credit packs purchased through secure Stripe Checkout
- Personal gallery of every generated image with one-click downloads
- Automatic profile provisioning with free starter credits on signup
- Responsive, animated interface built on the shadcn-ui component system

## Architecture

```
User Browser
     |
     v
React SPA  (Vite, TypeScript, Tailwind, shadcn-ui)
     |
     |  Supabase JS client
     v
Supabase Platform
  ├─ Auth            Email and Google OAuth, session management
  ├─ Postgres        profiles and generated_images with row level security
  └─ Edge Functions  (Deno)
        ├─ generate-image   FLUX.1-schnell inference, then Cloudinary upload
        ├─ get-credits      returns current balance
        ├─ deduct-credits   metered usage
        ├─ create-payment   Stripe Checkout session
        ├─ payment-webhook  credit fulfillment on payment success
        └─ my-images        gallery listing
     |
     +--> Hugging Face FLUX.1-schnell   image synthesis
     +--> Cloudinary                    image hosting and delivery
     +--> Stripe                        payment processing
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 with TypeScript |
| Build tool | Vite with the SWC React plugin |
| Styling | Tailwind CSS and shadcn-ui |
| Routing | React Router |
| Data fetching | TanStack Query |
| Forms and validation | React Hook Form with Zod |
| Authentication | Supabase Auth |
| Database | Supabase Postgres with row level security |
| Serverless | Supabase Edge Functions on Deno |
| Image model | Hugging Face FLUX.1-schnell |
| Image hosting | Cloudinary |
| Payments | Stripe Checkout |

## How It Works

1. A user signs in and a profile is created automatically with ten free credits.
2. On the Generate page the user writes a prompt, optionally adds a negative prompt, and selects a style preset and aspect ratio.
3. The client calls the `generate-image` edge function, which verifies the user, checks the credit balance, and sends the composed prompt to FLUX.1-schnell.
4. The returned image is uploaded to Cloudinary, one credit is deducted, and a record is written to the gallery.
5. The image URL and remaining balance are returned to the client for preview and download.
6. When credits run low, the user buys a pack. The `create-payment` function opens a Stripe Checkout session and the `payment-webhook` function credits the account after successful payment.

## Pricing and Credits

New accounts receive ten free credits. Each image generation costs one credit.

| Plan | Price | Credits | Highlights |
| --- | --- | --- | --- |
| Starter | ₹199 | 50 | Standard quality, basic styles |
| Popular | ₹499 | 150 | HD quality, all styles, commercial license |
| Pro | ₹999 | 400 | Ultra HD, exclusive styles, API access |

Credits never expire and all payments are processed securely through Stripe.

## Project Structure

```
project25/
├── src/
│   ├── components/       Shared UI, style presets, aspect ratios, shadcn components
│   ├── contexts/         Authentication context and provider
│   ├── hooks/            Profile and utility hooks
│   ├── integrations/     Supabase client and generated types
│   ├── pages/            Index, Auth, Dashboard, Generate, MyImages, BuyCredits, NotFound
│   ├── lib/              Shared helpers
│   ├── App.tsx           Providers and route definitions
│   └── main.tsx          Application entry point
├── supabase/
│   ├── functions/        Edge functions for generation, credits, and payments
│   ├── migrations/       SQL schema and policies
│   └── config.toml       Function configuration
├── public/               Static assets
├── index.html
├── vite.config.ts
└── package.json
```

## Getting Started

Prerequisites: Node.js version 18 or newer and npm.

Install dependencies:

```bash
npm install
```

Create a `.env` file with your Supabase project values (see [Environment Variables](#environment-variables)).

Start the development server:

```bash
npm run dev
```

The application runs at `http://localhost:8080`.

## Backend Setup

The backend runs on Supabase. To provision your own instance:

Install the Supabase CLI and link your project:

```bash
npm install -g supabase
supabase login
supabase link --project-ref your_project_ref
```

Apply the database migrations:

```bash
supabase db push
```

Deploy the edge functions:

```bash
supabase functions deploy
```

Set the edge function secrets required by the generation and payment flows:

```bash
supabase secrets set HUGGING_FACE_ACCESS_TOKEN=your_token
supabase secrets set CLOUDINARY_CLOUD_NAME=your_cloud_name
supabase secrets set CLOUDINARY_API_KEY=your_api_key
supabase secrets set CLOUDINARY_API_SECRET=your_api_secret
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Environment Variables

The frontend reads the following values from a `.env` file in the project root:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project identifier |

The edge functions require these server-side secrets, set through the Supabase CLI rather than committed to the repository:

| Secret | Purpose |
| --- | --- |
| `HUGGING_FACE_ACCESS_TOKEN` | Access to the FLUX.1-schnell inference API |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier |
| `CLOUDINARY_API_KEY` | Cloudinary upload authentication |
| `CLOUDINARY_API_SECRET` | Cloudinary signature signing |
| `STRIPE_SECRET_KEY` | Stripe payment processing |

## Database Schema

`profiles`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key, references the auth user |
| full_name | text | Set from signup metadata |
| email | text | User email |
| credits | integer | Defaults to 10 on signup |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Auto-updated on change |

`generated_images`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | Owner reference |
| prompt | text | Prompt used for generation |
| image_url | text | Cloudinary delivery URL |
| credits_used | integer | Credits spent on the image |

A database trigger creates a profile with ten credits whenever a new user signs up, and row level security ensures each user can only read and modify their own records.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using development mode settings |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Security

- Row level security restricts every table so users access only their own data.
- Credit deductions run server-side inside edge functions using a privileged service role, preventing client tampering.
- API keys for the image model, Cloudinary, and Stripe are stored as Supabase secrets and never reach the browser.
- Payments are handled entirely by Stripe Checkout, so card data never touches the application.

## Roadmap

- Image-to-image and inpainting workflows
- Prompt history and reusable prompt templates
- Team workspaces with shared credit pools
- Public API with key management for the Pro tier
- Additional models and higher resolution outputs

## Contributing

Contributions are welcome. Fork the repository, create a feature branch, commit your changes, and open a pull request with a clear description.

## License

This project is released under the MIT License.

## Author

Created by [Kumar44developer](https://github.com/Kumar44developer).
