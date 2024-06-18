/*
  Warnings:

  - You are about to drop the column `product_collection_status_id` on the `product_collections` table. All the data in the column will be lost.
  - You are about to drop the `product_collection_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'AGUARDANDO_ESTOQUE', 'ENVIADO', 'CANCELADO', 'CONCLUIDO');

-- DropForeignKey
ALTER TABLE "product_collections" DROP CONSTRAINT "product_collections_product_collection_status_id_fkey";

-- AlterTable
ALTER TABLE "product_collections" DROP COLUMN "product_collection_status_id",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDENTE';

-- DropTable
DROP TABLE "product_collection_status";
