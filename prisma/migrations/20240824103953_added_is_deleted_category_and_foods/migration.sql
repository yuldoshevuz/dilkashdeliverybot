-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
