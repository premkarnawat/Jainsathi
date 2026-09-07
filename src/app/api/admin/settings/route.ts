import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await query(`SELECT key, value, updated_at FROM site_settings;`);
    const settings: Record<string, any> = {};

    rows.forEach((r: any) => {
      settings[r.key] = typeof r.value === 'string' ? JSON.parse(r.value) : r.value;
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('[Admin Settings GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, settings } = body;

    if (key && value) {
      await query(
        `INSERT INTO site_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
        [key, JSON.stringify(value)]
      );
    } else if (settings && typeof settings === 'object') {
      for (const [k, v] of Object.entries(settings)) {
        await query(
          `INSERT INTO site_settings (key, value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
          [k, JSON.stringify(v)]
        );
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid settings payload' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated and saved successfully!',
    });
  } catch (error: any) {
    console.error('[Admin Settings POST Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
