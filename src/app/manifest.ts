import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Ouro Nas Estrelas - Astrologia & Autoconhecimento',
        short_name: 'Ouro Nas Estrelas',
        description: 'Seu portal diário de astrologia, numerologia e sabedoria ancestral. Descubra a si mesmo.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f0a1e', // mystic-950
        theme_color: '#EAB308', // gold-500
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
