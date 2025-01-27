/*
  Warnings:

  - You are about to drop the column `provider_id` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_provider_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "provider_id",
ADD COLUMN     "providerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
