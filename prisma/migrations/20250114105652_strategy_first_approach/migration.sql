/*
  Warnings:

  - You are about to drop the column `journalId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the `Journal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalField` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategyId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('ORDER_PLACED', 'OPEN', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalField" DROP CONSTRAINT "JournalField_journalId_fkey";

-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_journalId_fkey";

-- DropIndex
DROP INDEX "Trade_journalId_idx";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "journalId",
ADD COLUMN     "backtestId" TEXT,
ADD COLUMN     "liveJournalId" TEXT,
ADD COLUMN     "status" "TradeStatus" NOT NULL,
ADD COLUMN     "strategyId" TEXT NOT NULL,
ALTER COLUMN "closeDate" DROP NOT NULL,
ALTER COLUMN "result" DROP NOT NULL,
ALTER COLUMN "pnl" DROP NOT NULL;

-- DropTable
DROP TABLE "Journal";

-- DropTable
DROP TABLE "JournalField";

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyField" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "options" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveJournal" (
    "id" TEXT NOT NULL,
    "strategyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backtest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "strategyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Backtest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Strategy_userId_idx" ON "Strategy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_name_userId_key" ON "Strategy"("name", "userId");

-- CreateIndex
CREATE INDEX "StrategyField_strategyId_idx" ON "StrategyField"("strategyId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveJournal_strategyId_key" ON "LiveJournal"("strategyId");

-- CreateIndex
CREATE INDEX "Backtest_strategyId_idx" ON "Backtest"("strategyId");

-- CreateIndex
CREATE INDEX "Trade_strategyId_idx" ON "Trade"("strategyId");

-- CreateIndex
CREATE INDEX "Trade_liveJournalId_idx" ON "Trade"("liveJournalId");

-- CreateIndex
CREATE INDEX "Trade_backtestId_idx" ON "Trade"("backtestId");

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyField" ADD CONSTRAINT "StrategyField_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveJournal" ADD CONSTRAINT "LiveJournal_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backtest" ADD CONSTRAINT "Backtest_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_liveJournalId_fkey" FOREIGN KEY ("liveJournalId") REFERENCES "LiveJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_backtestId_fkey" FOREIGN KEY ("backtestId") REFERENCES "Backtest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
