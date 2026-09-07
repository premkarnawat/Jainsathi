import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const rows = await query(`SELECT value FROM site_settings WHERE key = $1;`, [key]);
      if (rows.length > 0) {
        const val = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
        return NextResponse.json({ success: true, [key]: val });
      }
      return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 });
    }

    const rows = await query(`SELECT key, value FROM site_settings;`);
    const settings: Record<string, any> = {};
    rows.forEach((r: any) => {
      settings[r.key] = typeof r.value === 'string' ? JSON.parse(r.value) : r.value;
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
