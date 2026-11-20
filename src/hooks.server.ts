import type { Handle } from '@sveltejs/kit/hooks';

export const handle: Handle = ({ event, resolve }) => {
  const lang = event.url.pathname === '/en' || event.url.pathname.startsWith('/en/') ? 'en' : 'id';

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
