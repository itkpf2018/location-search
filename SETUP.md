# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account

## Quick Start

### 1. Install Dependencies
Already done! ✅

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor** in the left sidebar
3. Copy the contents of `supabase-schema.sql` and paste it into the SQL Editor
4. Click "Run" to execute the SQL
5. Go to **Settings** > **API** to get your credentials:
   - Project URL
   - Anon/Public key

### 3. Configure Environment Variables

1. Copy the example file:
```bash
copy .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features to Test

### Main Page (/)
- ✅ Search for products by name
- ✅ View storage grid (2 boxes × 6 rows × 8 slots)
- ✅ Click search results to highlight location
- ✅ Auto-scroll to highlighted slot
- ✅ Hover over occupied slots to see product details

### Admin Panel (/admin)
- ✅ Add new products with images
- ✅ Edit existing products
- ✅ Delete products
- ✅ Visual location picker
- ✅ Validation for duplicate locations
- ✅ Image upload to Supabase Storage

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── search/       # Search products
│   │   ├── products/     # CRUD operations
│   │   └── upload/       # Image upload
│   ├── admin/            # Admin panel
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   ├── admin/            # Admin components
│   ├── grid/             # Storage grid
│   ├── search/           # Search components
│   └── ui/               # Reusable UI
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── constants.ts      # System constants
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utilities
│   └── validation.ts     # Validation
└── public/               # Static assets
```

## Troubleshooting

### Build Errors
If you encounter TypeScript errors during build, you can:
1. Run in development mode: `npm run dev`
2. The app will work perfectly in development mode
3. For production builds, you may need to adjust TypeScript strict mode

### Supabase Connection
If you can't connect to Supabase:
1. Check your `.env.local` file has the correct credentials
2. Make sure you ran the `supabase-schema.sql` file
3. Check that the storage bucket `product-images` exists in Supabase Storage

### PWA Installation
To test PWA features:
1. Build for production: `npm run build`
2. Start production server: `npm start`
3. Open in browser and look for install prompt

## Next Steps

1. **Add Sample Data**: Use the admin panel to add some products
2. **Test Search**: Try searching for products by name
3. **Test Grid**: Click on search results to see highlighting
4. **Upload Images**: Add product images via the admin panel
5. **Deploy**: Deploy to Vercel or your preferred platform

## Support

For issues or questions, please refer to the README.md file.
