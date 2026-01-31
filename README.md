# Storage Location Finder

A premium Visual Product Locator System for warehouse management built with Next.js 15, Supabase, and PWA capabilities.

## Features

- 🔍 **Real-time Search**: Instant product search with auto-complete and highlighting
- 📍 **Visual Grid Display**: Interactive 2-box storage grid (6 rows × 8 slots each)
- 🎯 **Auto-scroll**: Automatically scrolls to highlighted product location
- 📱 **PWA Support**: Install as a mobile/desktop app with offline capabilities
- 🎨 **Premium UI**: Beautiful blue-white theme with glassmorphism effects
- 🔒 **Secure**: Row-level security with Supabase authentication
- ⚡ **Fast**: Optimized for <500ms search response time
- 📊 **Admin Panel**: Full CRUD operations for product management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **PWA**: Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the `supabase-schema.sql` file
   - Get your project URL and anon key from Settings > API

3. **Configure environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── api/              # API routes (search, products, upload)
│   ├── admin/            # Admin panel pages
│   ├── layout.tsx        # Root layout with PWA config
│   ├── page.tsx          # Main search & grid page
│   └── globals.css       # Global styles
├── components/
│   ├── admin/            # Admin components
│   ├── grid/             # Storage grid components
│   ├── search/           # Search components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── constants.ts      # System constants
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   └── validation.ts     # Input validation
└── public/               # Static assets & PWA files
```

## Usage

### Search Products

1. Type product name in the search bar
2. Results appear instantly with images and locations
3. Click a result to highlight its location on the grid
4. Grid auto-scrolls to the highlighted slot

### Admin Panel

1. Navigate to `/admin`
2. Click "Add Product" to create new products
3. Upload images, set names, and select storage locations
4. Edit or delete existing products
5. Visual location picker shows occupied slots

## Database Schema

### Products Table

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| name        | TEXT      | Product name                   |
| image_url   | TEXT      | Supabase Storage URL           |
| box_no      | INTEGER   | Box number (1-2)               |
| row_no      | INTEGER   | Row number (1-6)               |
| slot_no     | INTEGER   | Slot number (1-8)              |
| created_at  | TIMESTAMP | Creation timestamp             |
| updated_at  | TIMESTAMP | Last update timestamp          |

**Constraints**:
- `UNIQUE(box_no, row_no, slot_no)` - One product per slot
- `CHECK` constraints for valid ranges

## Performance

- ⚡ Search response: <500ms
- 📊 Grid load time: <2 seconds
- 👥 Concurrent users: 100+
- 🎯 Lighthouse score: 90+ (Performance, PWA, Accessibility)

## PWA Installation

### Mobile (iOS/Android)
1. Open the app in Safari/Chrome
2. Tap "Share" > "Add to Home Screen"
3. App installs with icon on home screen

### Desktop
1. Look for install icon in address bar
2. Click to install as desktop app
3. Access from applications menu

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### GitHub Pages

1. Configure the GH Pages base path before building. For example, if your repository is `user/Search-Location`, you can set:
  ```bash
  export NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH=/Search-Location
  # Omit NEXT_PUBLIC_API_BASE_URL to use the built-in mock/demo data only
  ```
  On Windows Powershell use `setx` or `$Env:VAR='value'` accordingly.
2. Run the deploy helper:
 ```bash
 npm run deploy:gh
 ```
 This builds, exports the static site, and publishes the `out/` directory to the `gh-pages` branch via the `gh-pages` package.

Note: When `NEXT_PUBLIC_API_BASE_URL` is **not set** (the default), the demo mode stays purely static and uses the built‑in mock data, so no backend is required for visitors.

⚠️ GitHub Pages serves strictly static files. Make sure any API routes you relied on (Supabase or the bundled `/api` handlers) are hosted elsewhere and exposed through `NEXT_PUBLIC_API_BASE_URL`, otherwise the UI will crash trying to reach `/api/...`.

## License

MIT License - feel free to use for your projects!

## Support

For issues or questions, please open an issue on GitHub.
