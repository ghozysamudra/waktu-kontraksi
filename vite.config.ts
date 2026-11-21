import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_SITE_URL = 'https://waktu-kontraksi.pages.dev';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'PUBLIC_');
  const siteUrl = (process.env.PUBLIC_SITE_URL ?? env.PUBLIC_SITE_URL ?? '').trim() || DEFAULT_SITE_URL;
  const siteOrigin = new URL(siteUrl).origin;

  return {
    plugins: [
      sveltekit({
        adapter: adapter(),
        inlineStyleThreshold: 24576,
        paths: {
          origin: siteOrigin,
          relative: false
        },
        prerender: {
          entries: ['*', '/404', '/robots.txt', '/sitemap.xml', '/llms.txt', '/.well-known/ard.json']
        }
      })
    ]
  };
});
