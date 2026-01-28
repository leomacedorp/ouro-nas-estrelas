import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Limpando horóscopos antigos...');

    // Apaga TODOS os horóscopos do dia para forçar nova geração
    const deleted = await prisma.dailyHoroscope.deleteMany({});

    console.log(`✅ ${deleted.count} registros deletados.`);
    console.log('✨ Agora o sistema vai gerar textos frescos V2 automaticamente.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
