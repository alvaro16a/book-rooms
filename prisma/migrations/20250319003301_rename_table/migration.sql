/*
  Warnings:

  - You are about to drop the `Rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Rooms";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "externalView" BOOLEAN NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
