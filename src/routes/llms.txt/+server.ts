import { getCanonicalUrl, siteName, siteUrl } from '../../lib/site';

export const prerender = true;

export function GET() {
  const idUrl = getCanonicalUrl('id');
  const enUrl = getCanonicalUrl('en');

  const body = `# ${siteName}

> A calm, privacy-first labor contraction timer web app in Indonesian and English. Track contraction duration and start-to-start intervals with one tap, view summary metrics, and understand the 5-1-1, 3-1-1, and 2-1-1 contraction patterns. All logs and active timers stay strictly in browser localStorage and are never uploaded to a server.

## Pages

- [Waktu Kontraksi (Bahasa Indonesia)](${idUrl}): Default Indonesian contraction timer, live summary, contraction history table, and inline 5-1-1 guide & FAQ.
- [Contraction Timer (English)](${enUrl}): English version of the labor contraction timer, live summary, contraction history table, and inline 5-1-1 guide & FAQ.

## Key Concepts

- **Duration**: Time from the start to the end of a single contraction.
- **Interval**: Time measured from the start of one contraction to the start of the next contraction.
- **5-1-1 Pattern**: Contractions coming regularly every 5 minutes, lasting about 1 minute each, and repeating for at least 1 hour (with 3-1-1 and 2-1-1 indicating 3-minute and 2-minute intervals).
- **Medical Guidance**: Labor stage and cervical dilation must be assessed by a qualified healthcare professional. Expectant parents should contact a midwife or maternity unit immediately if their waters break, there is vaginal bleeding, or fetal movement decreases.

## Discovery & References

- [XML Sitemap](${siteUrl}/sitemap.xml): Multilingual sitemap with hreflang alternates for Indonesian and English pages.
- [ARD Manifest](${siteUrl}/.well-known/ard.json): Agentic Resource Discovery manifest cataloging this site's machine-readable documentation.
- [NHS: Signs that labour has begun](https://www.nhs.uk/pregnancy/labour-and-birth/signs-that-labour-has-begun/): External clinical reference linked from the in-app guide.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
