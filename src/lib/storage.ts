/**
 * Helper to resolve Supabase Storage URLs cleanly
 */
export function getStorageUrl(path?: string | null, bucket: string = 'profile-photos'): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // If it's an old hardcoded URL with the outdated reference, fix the hostname
    if (path.includes('hchxytnssymfobqohowk.supabase.co') || path.includes('jainsaathi-matrimony.supabase.co')) {
      return path.replace(/(hchxytnssymfobqohowk|jainsaathi-matrimony)\.supabase\.co/, 'vqnbypdytxkmqgdsbswv.supabase.co');
    }
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqnbypdytxkmqgdsbswv.supabase.co';
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}
