-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('cancel', 'pending', 'paid');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
