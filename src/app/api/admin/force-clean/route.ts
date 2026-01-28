import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';

// Força a rota a não ser cacheada estaticamente
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("🧹 TENTATIVA 2: Limpeza BRUTA do cache...");
        const today = getTodayBrazil();

        // Estratégia A: Deletar pelo dia de hoje (garantido de existir)
        const delToday = await supabase
            .from('horoscopes')
            .delete()
            .eq('date', today);

        // Estratégia B: Deletar TUDO que for do signo de Capricórnio (test case)
        const delCapri = await supabase
            .from('horoscopes')
            .delete()
            .eq('sign', 'capricornio');

        // Estratégia C: Deletar logs antigos também se existirem
        // (supondo que possa ter outra tabela, mas vamos focar na principal)

        if (delToday.error) throw new Error(`Erro Deletar Hoje: ${delToday.error.message}`);
        if (delCapri.error) throw new Error(`Erro Deletar Capri: ${delCapri.error.message}`);

        return NextResponse.json({
            success: true,
            message: "EXTERMINADO COM SUCESSO 💀",
            details: {
                todayDeleted: delToday.count, // pode vir null dependendo da config do supabase
                capriDeleted: delCapri.count
            },
            hint: "Volte para a Home e recarregue. Se ainda tiver cache, é obra do tinhoso."
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
