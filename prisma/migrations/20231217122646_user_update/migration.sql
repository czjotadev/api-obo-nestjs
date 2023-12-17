/*
  Warnings:

  - You are about to drop the column `image_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `user_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_contacts" DROP CONSTRAINT "user_contacts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_image_id_fkey";

-- DropIndex
DROP INDEX "users_image_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_id",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "user_addresses";

-- DropTable
DROP TABLE "user_contacts";

-- DropTable
DROP TABLE "user_images";
