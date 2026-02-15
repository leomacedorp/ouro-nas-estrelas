import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    if (!content) return null;

    // Processar o texto:
    // 1. Quebra em parágrafos por \n\n
    // 2. Processa **negrito**
    const sections = content.split(/\n\n+/);

    return (
        <div className={`space-y-4 text-slate-300 ${className}`}>
            {sections.map((section, index) => {
                // Se for uma lista (começa com - ou *)
                if (section.trim().startsWith('- ') || section.trim().startsWith('* ')) {
                    const items = section.split(/\n/).map(s => s.replace(/^[-*]\s/, ''));
                    return (
                        <ul key={index} className="list-disc pl-5 space-y-2">
                            {items.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: parseBold(item) }} />
                            ))}
                        </ul>
                    );
                }

                // Parágrafo normal
                return (
                    <p
                        key={index}
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseBold(section) }}
                    />
                );
            })}
        </div>
    );
}

// Função auxiliar simples para **negrito** (evita libs pesadas)
function parseBold(text: string): string {
    // Escapar HTML básico para segurança (XSS básico)
    let safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // Substituir **texto** por <strong>texto</strong>
    // Suporta múltiplas ocorrências
    return safeText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}
