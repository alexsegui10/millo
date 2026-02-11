/*
  Warnings:

  - A unique constraint covering the columns `[instagramHandle]` on the table `Niche` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'VIEWER');

-- AlterTable - Add columns with defaults first
ALTER TABLE "User" ADD COLUMN "fullName" TEXT;
ALTER TABLE "User" ADD COLUMN "role" "UserRole" DEFAULT 'VIEWER';

-- Update existing rows with default values
UPDATE "User" SET "fullName" = 'Admin User' WHERE "fullName" IS NULL;
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@ofmagency.com';
UPDATE "User" SET "role" = 'VIEWER' WHERE "role" IS NULL;

-- Now make fullName NOT NULL
ALTER TABLE "User" ALTER COLUMN "fullName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Niche_instagramHandle_key" ON "Niche"("instagramHandle");
