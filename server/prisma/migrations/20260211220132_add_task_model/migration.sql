-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DAILY', 'ONE_OFF');

-- AlterTable
ALTER TABLE "Niche" ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "type" "TaskType" NOT NULL DEFAULT 'ONE_OFF',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
