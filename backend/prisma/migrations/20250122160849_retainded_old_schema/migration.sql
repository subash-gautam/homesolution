/*
  Warnings:

  - You are about to drop the column `Status` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `sent_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `min_charge` on the `Service` table. All the data in the column will be lost.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sender` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `mincharge` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "senderType" AS ENUM ('user', 'provider');

-- CreateEnum
CREATE TYPE "bookingStatus" AS ENUM ('pending', 'verified');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "Status",
DROP COLUMN "bookingDate",
ADD COLUMN     "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "bookingStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sent_at",
ADD COLUMN     "SentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "sender",
ADD COLUMN     "sender" "senderType" NOT NULL;

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "city" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "created_at",
DROP COLUMN "image",
DROP COLUMN "min_charge",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mincharge" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "service_image" BYTEA,
ALTER COLUMN "type" DROP NOT NULL;

-- DropEnum
DROP TYPE "userType";
