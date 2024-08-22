/*
  Warnings:

  - You are about to drop the column `locations` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "locations",
ADD COLUMN     "location" JSONB DEFAULT '[]';
