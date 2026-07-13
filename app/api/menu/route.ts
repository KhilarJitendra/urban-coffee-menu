import { NextResponse } from 'next/server';
import Papa from 'papaparse';

// Published Google Sheets CSV — update the sheet and the menu auto-refreshes.
const SHEET_CSV_URL = process.env.GOOGLE_SHEET_CSV_URL!;

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuData {
  [category: string]: MenuItem[];
}

type RawRow = Record<string, string>;

function groupRows(rows: RawRow[]): MenuData {
  const result: MenuData = {};
  for (const row of rows) {
    const available = (row['Available'] ?? row['available'] ?? '').trim().toLowerCase();
    if (available !== 'yes') continue;

    const cat = (row['Category'] || row['category'] || 'Other').trim();
    if (!result[cat]) result[cat] = [];

    result[cat].push({
      name: (row['Item Name'] || row['item name'] || row['name'] || '').trim(),
      description: (row['Description'] || row['description'] || '').trim(),
      price: (row['Price'] || row['price'] || '').trim(),
    });
  }
  return result;
}

export async function GET() {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      // Vercel ISR: serve cached response, revalidate in background every 60s
      next: { revalidate: 1 },
    });

    if (!res.ok) {
      throw new Error(`Google Sheets fetch failed: ${res.status} ${res.statusText}`);
    }

    const csv = await res.text();
    const { data, errors } = Papa.parse<RawRow>(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.warn('[/api/menu] CSV parse warnings:', errors);
    }

    return NextResponse.json(groupRows(data), {
      headers: {
        // Allow the browser to cache for 60s too
        'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=10',
      },
    });
  } catch (err) {
    console.error('[/api/menu]', err);
    return NextResponse.json(
      { error: 'Failed to load menu data. Please try again later.' },
      { status: 500 }
    );
  }
}