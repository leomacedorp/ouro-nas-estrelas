"use client";

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface DownloadPDFButtonProps {
    targetId: string;
    fileName?: string;
}

export default function DownloadPDFButton({ targetId, fileName = 'minha-leitura.pdf' }: DownloadPDFButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setIsGenerating(true);

        try {
            // Captura o elemento com html2canvas
            const canvas = await html2canvas(element, {
                scale: 2, // Melhora resolução
                useCORS: true, // Permite imagens externas
                backgroundColor: '#0f0a1f', // Cor de fundo do tema (mystic-950)
                logging: false,
                windowWidth: 1200 // Força largura desktop para evitar layout mobile no PDF
            });

            // Dimensões do PDF (A4)
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // Largura A4 em mm
            const pageHeight = 297; // Altura A4 em mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Adiciona primeira página
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Se for maior que uma página, cria novas
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(fileName);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button onClick={handleDownload} disabled={isGenerating}>
            <ShimmerButton className="px-6 py-3 min-w-[200px]">
                {isGenerating ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Gerando PDF...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Download className="w-5 h-5" /> Baixar PDF Premium
                    </span>
                )}
            </ShimmerButton>
        </button>
    );
}
