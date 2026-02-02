import type { MetadataRoute } from 'next';
import { ZODIAC_SIGNS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://ouronasestrelas.com.br').replace(/\/$/, '');

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/leitura-premium`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const signUrls: MetadataRoute.Sitemap = ZODIAC_SIGNS.flatMap((s) => ([
    {
      url: `${base}/signos/${s.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${base}/signos/${s.slug}/semana`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${base}/signos/${s.slug}/mes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]));

  return [...staticUrls, ...signUrls];
}
