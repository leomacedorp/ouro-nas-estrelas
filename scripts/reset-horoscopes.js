const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Limpando horóscopos antigos...');

    try {
        // Apaga TODOS os horóscopos do dia para forçar nova geração
        const deleted = await prisma.dailyHoroscope.deleteMany({});

        console.log(`✅ ${deleted.count} registros deletados.`);
        console.log('✨ Agora o sistema vai gerar textos frescos V2 automaticamente.');
    } catch (e) {
        console.error("Erro ao limpar banco:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
