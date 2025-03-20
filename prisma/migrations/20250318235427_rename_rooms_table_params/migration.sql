/*
  Warnings:

  - You are about to drop the column `tipe` on the `Rooms` table. All the data in the column will be lost.
  - Added the required column `type` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "tipe",
ADD COLUMN     "type" "RoomType" NOT NULL;
