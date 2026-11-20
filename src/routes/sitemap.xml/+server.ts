import { getCanonicalUrl } from '../../lib/site';

export const prerender = true;

const buildDate = new Date().toISOString().slice(0, 10);

export function GET() {
  const idUrl = getCanonicalUrl('id');
  const enUrl = getCanonicalUrl('en');

  const urls = [idUrl, enUrl];
  const entries = urls
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${buildDate}</lastmod>
    <xhtml:link rel="alternate" hreflang="id" href="${idUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${idUrl}" />
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
