-- CreateEnum
CREATE TYPE "Typepoint" AS ENUM ('Redeem', 'refferal');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "refferedCode" TEXT;

-- CreateTable
CREATE TABLE "UserPoint" (
    "id" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "isRedeem" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserPoint_pkey" PRIMARY KEY ("id")
);
