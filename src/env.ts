import { defineEnvVars } from '@sveltejs/kit/env';

const DEFAULT_SITE_URL = 'https://waktu-kontraksi.pages.dev';

export const variables = defineEnvVars({
  PUBLIC_SITE_URL: {
    public: true,
    static: true,
    description: 'Canonical site URL for Open Graph, canonical links, sitemap.xml, and robots.txt',
    schema: (value) => {
      const raw = (value ?? '').trim() || DEFAULT_SITE_URL;
      return new URL(raw).toString().replace(/\/$/, '');
    }
  }
});
