import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        console.log("🧹 Iniciando limpeza do cache do Supabase...");

        // Deleta todos os horóscopos do banco para forçar regeneração
        // Como o supabase-js não tem 'deleteMany' direto sem filtro em algumas versões,
        // usamos um filtro que pega tudo (ex: id > 0 ou data não nula)
        // Mas a maneira mais segura é deletar onde a data é hoje, ou tudo.

        // Vamos deletar tudo que tem id (ou seja, tudo)
        const { error, count } = await supabase
            .from('horoscopes')
            .delete()
            .neq('id', 0); // Hack comum para deletar tudo: id != 0 (assumindo ids positivos)

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({
            success: true,
            message: `Limpeza concluída! Cache do Supabase removido.`,
            hint: "Agora recarregue a página inicial."
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
