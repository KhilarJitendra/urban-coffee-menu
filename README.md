# Urban Coffee

Official website and digital menu for Urban Coffee, built with Next.js.

## Features

- Responsive modern UI
- Dynamic menu powered by Google Sheets
- Category-based menu navigation
- Menu search functionality
- Server-side API using Next.js Route Handlers
- Automatic menu updates with cache revalidation
- Mobile-friendly design
- Environment variable support

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Papa Parse

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
git clone https://github.com/KhilarJitendra/urban-cafe.git
cd urban-cafe
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root.

```env
GOOGLE_SHEET_CSV_URL=YOUR_GOOGLE_SHEETS_CSV_URL
```

### Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Build

```bash
pnpm build
```

## Start Production Server

```bash
pnpm start
```

## Project Structure

```
app/
├── api/
│   └── menu/
├── components/
├── public/
└── ...
```

## Deployment

The project is optimized for deployment on Vercel.

## License

This project is proprietary and intended for Urban Coffee.