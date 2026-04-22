/*
  Warnings:

  - Added the required column `seats` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "seats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "gateway" SET DEFAULT 'STRIPE';
