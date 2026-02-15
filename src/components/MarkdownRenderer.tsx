import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Markdown bem leve (sem deps), focado em:
 * - headings (#, ##, ###)
 * - listas (-, *)
 * - listas ordenadas (1.)
 * - parágrafos com quebras de linha
 * - **negrito**
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    if (!content) return null;

    const lines = String(content).replace(/\r\n/g, '\n').split('\n');

    type Block =
        | { type: 'h1' | 'h2' | 'h3'; text: string }
        | { type: 'ul'; items: string[] }
        | { type: 'ol'; items: string[] }
        | { type: 'p'; text: string };

    const blocks: Block[] = [];

    let paragraph: string[] = [];
    let ul: string[] | null = null;
    let ol: string[] | null = null;

    const flushParagraph = () => {
        const text = paragraph.join('\n').trim();
        if (text) blocks.push({ type: 'p', text });
        paragraph = [];
    };

    const flushLists = () => {
        if (ul && ul.length) blocks.push({ type: 'ul', items: ul });
        if (ol && ol.length) blocks.push({ type: 'ol', items: ol });
        ul = null;
        ol = null;
    };

    for (const raw of lines) {
        const line = raw ?? '';
        const t = line.trim();

        // Linha vazia separa blocos
        if (!t) {
            flushLists();
            flushParagraph();
            continue;
        }

        // Heading
        const h = t.match(/^(#{1,3})\s+(.*)$/);
        if (h) {
            flushLists();
            flushParagraph();
            const level = h[1].length;
            const text = h[2] || '';
            blocks.push({ type: level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3', text });
            continue;
        }

        // Bullet list
        const bullet = t.match(/^[-*]\s+(.*)$/);
        if (bullet) {
            flushParagraph();
            ol = null;
            ul = ul ?? [];
            ul.push(bullet[1] || '');
            continue;
        }

        // Ordered list
        const ordered = t.match(/^\d+\.\s+(.*)$/);
        if (ordered) {
            flushParagraph();
            ul = null;
            ol = ol ?? [];
            ol.push(ordered[1] || '');
            continue;
        }

        // Normal line (paragraph). Preserve single newlines as <br/>
        flushLists();
        paragraph.push(t);
    }

    flushLists();
    flushParagraph();

    return (
        <div className={`space-y-4 text-slate-300 ${className}`}>
            {blocks.map((b, idx) => {
                if (b.type === 'h1') {
                    return (
                        <h2 key={idx} className="text-2xl md:text-3xl font-serif font-bold text-white">
                            <span dangerouslySetInnerHTML={{ __html: parseInline(b.text) }} />
                        </h2>
                    );
                }

                if (b.type === 'h2') {
                    return (
                        <h3 key={idx} className="text-xl md:text-2xl font-serif font-bold text-white">
                            <span dangerouslySetInnerHTML={{ __html: parseInline(b.text) }} />
                        </h3>
                    );
                }

                if (b.type === 'h3') {
                    return (
                        <h4 key={idx} className="text-lg font-serif font-bold text-slate-100">
                            <span dangerouslySetInnerHTML={{ __html: parseInline(b.text) }} />
                        </h4>
                    );
                }

                if (b.type === 'ul') {
                    return (
                        <ul key={idx} className="list-disc pl-5 space-y-2">
                            {b.items.map((it, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(it) }} />
                            ))}
                        </ul>
                    );
                }

                if (b.type === 'ol') {
                    return (
                        <ol key={idx} className="list-decimal pl-5 space-y-2">
                            {b.items.map((it, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(it) }} />
                            ))}
                        </ol>
                    );
                }

                // paragraph
                return (
                    <p
                        key={idx}
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseInline(b.text).replace(/\n/g, '<br/>') }}
                    />
                );
            })}
        </div>
    );
}

function escapeHtml(text: string): string {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Inline: escape + **bold**
function parseInline(text: string): string {
    const safe = escapeHtml(text);
    return safe.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}
