/*
  Warnings:

  - You are about to drop the column `tipo` on the `Rooms` table. All the data in the column will be lost.
  - Added the required column `tipe` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'PRESIDENTIAL');

-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "tipo",
ADD COLUMN     "tipe" "RoomType" NOT NULL;

-- DropEnum
DROP TYPE "TipoHabitacion";
