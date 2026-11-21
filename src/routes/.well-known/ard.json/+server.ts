import { siteName, siteUrl } from '../../../lib/site';

export const prerender = true;

const updatedAt = new Date().toISOString();

export function GET() {
  const hostname = new URL(siteUrl).hostname.toLowerCase();

  const manifest = {
    entries: [
      {
        identifier: `urn:air:${hostname}:content:llms`,
        displayName: `${siteName} — Labor Contraction Timer`,
        type: 'text/markdown',
        url: `${siteUrl}/llms.txt`,
        description:
          'Bilingual (Indonesian and English) browser-based labor contraction timer and 5-1-1 pattern guide with private local-only storage.',
        tags: ['pregnancy', 'labor', 'contraction-timer', 'kontraksi', 'persalinan', 'health'],
        representativeQueries: [
          'time labor contractions and calculate duration and intervals',
          'track the 5-1-1 contraction pattern in the browser',
          'catat durasi dan jarak kontraksi persalinan',
          'hitung waktu kontraksi dan pola 5-1-1'
        ],
        updatedAt
      }
    ]
  };

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
