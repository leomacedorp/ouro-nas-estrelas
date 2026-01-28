export const siteConfig = {
    name: "Ouro Nas Estrelas",
    whatsapp: {
        number: "5516981469121",
        message_default: "Olá! Gostaria de saber mais sobre o Ouro Nas Estrelas.",
        cta_label: "Receber Minha Mensagem",
        url: function (message?: string) {
            const msg = message || this.message_default;
            const cleanNumber = this.number.replace(/\D/g, '');
            return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
        }
    },
    links: {
        nav: [
            { name: 'Mensagem do Dia', href: '/' },
            { name: 'Consulta Simbólica', href: '/consulta' },
            { name: 'Clube Ouro', href: '/clube' },
            { name: 'Produtos', href: '/produtos' },
            { name: 'Contato', href: '/contato' },
        ],
        footer: {
            explore: [
                { name: 'Horóscopo Diário', href: '/horoscopo' },
                { name: 'Todos os Signos', href: '/signos' },
                { name: 'Mapa Astral', href: '/mapa-astral' },
                { name: 'Consulta Simbólica', href: '/consulta' },
            ],
            legal: [
                { name: 'Termos de Uso', href: '/termos' },
                { name: 'Privacidade', href: '/privacidade' },
                { name: 'Fale Conosco', href: '/contato' },
            ]
        }
    },
    cta: {
        default: "Receber Orientação Agora",
        sales: "Quero Minha Leitura",
        newsletter: "Inscrever-se",
        sign_conversion: "Receber leitura completa no WhatsApp"
    }
};
