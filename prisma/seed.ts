import { PrismaClient, RoomType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const rooms: { type: RoomType; externalView: boolean }[] = [];

    for (let i = 1; i <= 10; i++) {
        rooms.push({ type: RoomType.SINGLE, externalView: i % 2 === 0 });
        rooms.push({ type: RoomType.DOUBLE, externalView: i % 2 !== 0 });
        rooms.push({ type: RoomType.PRESIDENTIAL, externalView: i % 3 === 0 });
    }

    await prisma.room.createMany({
        data: rooms
    });

    console.log(' Se generaron 30 habitaciones correctamente.');
}

main()
    .catch((error) => {
        console.error(' Error al generar las habitaciones:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
