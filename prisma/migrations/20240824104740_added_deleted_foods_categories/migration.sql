/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `foods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "isDeleted",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "foods" DROP COLUMN "isDeleted",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
