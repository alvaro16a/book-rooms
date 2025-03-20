-- CreateEnum
CREATE TYPE "TipoHabitacion" AS ENUM ('SENCILLA', 'DOBLE', 'PRESIDENCIAL');

-- CreateTable
CREATE TABLE "Rooms" (
    "id" TEXT NOT NULL,
    "tipo" "TipoHabitacion" NOT NULL,
    "externalView" BOOLEAN NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);
