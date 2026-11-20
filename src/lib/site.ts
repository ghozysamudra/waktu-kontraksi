import { PUBLIC_SITE_URL } from '$app/env/public';
import type { Language } from './translations';

export const siteName = 'Waktu Kontraksi';
export const siteUrl = PUBLIC_SITE_URL;

export function getRoutePath(language: Language): string {
  return language === 'en' ? '/en' : '/';
}

export function getCanonicalUrl(language: Language): string {
  return `${siteUrl}${getRoutePath(language)}`;
}

export function getOgImageUrl(language: Language): string {
  return `${siteUrl}/${language === 'en' ? 'og-image-en.png' : 'og-image.png'}`;
}
