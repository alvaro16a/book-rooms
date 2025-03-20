/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `baseValueApply` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfDays` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfNights` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDaysDiscount` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendIncrement` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "totalPrice",
ADD COLUMN     "baseValueApply" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "numberOfDays" INTEGER NOT NULL,
ADD COLUMN     "numberOfNights" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalDaysDiscount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "weekendIncrement" DECIMAL(10,2) NOT NULL;
