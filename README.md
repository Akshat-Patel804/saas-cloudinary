# 04-saas-cloudinary

Lightweight Next.js SaaS demo integrating Cloudinary for image/video uploads, Prisma (Postgres) for persistence, and Clerk for authentication.

## Features
- Upload videos (client-side upload + server upload to Cloudinary)
- Upload and transform images for social media formats (preview and download)
- Browse uploaded videos with thumbnails, preview, download, and basic compression stats
- Server API routes for uploads and a simple videos listing backed by Prisma

## Tech stack
- Next.js (App Router)
- React 19
- Prisma (Postgres) with `@prisma/adapter-pg`
- Cloudinary (image & video hosting + transformations)
- Clerk for authentication
- Tailwind + DaisyUI for styling

## Repo layout (high level)
- `app/` — Next.js pages and nested layouts
	- `(app)/video-upload` — video upload UI
	- `(app)/social-share` — image upload + social transforms
	- `(app)/home` — video gallery
- `app/api/` — server routes: `image-upload`, `video-upload`, `videos`
- `prisma/schema.prisma` — Prisma model(s) (Video)
- `lib/prisma.ts` — Prisma client setup
- `components/` — UI components such as `VideoCard`

## Important environment variables
Create a `.env` file at the project root and provide the following (examples):

- `DATABASE_URL` — Postgres connection string used by Prisma
- Cloudinary credentials (server-side used by the upload routes):
	- `CLOUDINARY_CLOUD_NAME` or `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
	- `CLOUDINARY_API_KEY` or `NEXT_PUBLIC_API_KEY`
	- `CLOUDINARY_API_SECRET` or `NEXT_PUBLIC_API_SECRET`
- Clerk / auth configuration — set up Clerk credentials per their docs (used by `@clerk/nextjs`).

Note: the project reads several env variants (server vs public) in different files; ensure server-side secrets are available to Node (not exposed in the browser).

## Getting started (local)
1. Install dependencies:

```bash
npm install
```

2. Provide environment variables in `.env` (see above).

3. Generate or apply Prisma migrations (if you want local DB):

```bash
npx prisma migrate dev --name init
```

4. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Scripts
- `npm run dev` — start Next.js dev server
- `npm run build` — build for production
- `npm start` — start production server
- `npm run lint` — run ESLint

## API routes
- `POST /api/image-upload` — multipart image upload to Cloudinary (returns `{ publicId }`)
- `POST /api/video-upload` — multipart video upload to Cloudinary and save metadata in Prisma (requires auth)
- `GET /api/videos` — returns list of videos from the database

## Prisma `Video` model
Defined in `prisma/schema.prisma` and generated client under `generated/prisma`:

- `id`, `title`, `description`, `publicId`, `originalSize`, `compressSize`, `duration`, `createdAt`, `updatedAt`

## UI pages
- `/` — video gallery
- `/video-upload` — upload a video (client size check ~70MB)
- `/social-share` — upload image and create social-ready images
- `/sign-in` & `/sign-up` — Clerk auth pages


## Where to look in code
- Video upload route: [app/api/video-upload/route.ts](app/api/video-upload/route.ts#L1-L120)
- Image upload route: [app/api/image-upload/route.ts](app/api/image-upload/route.ts#L1-L200)
- Video model: [prisma/schema.prisma](prisma/schema.prisma#L1-L40)
- Video card UI: [components/VideoCard.tsx](components/VideoCard.tsx#L1-L240)
