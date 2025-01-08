/*
  Warnings:

  - You are about to drop the column `instrument` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentOptions` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentValue` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `pair` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "instrument",
DROP COLUMN "instrumentOptions";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "instrumentValue",
ADD COLUMN     "pair" TEXT NOT NULL;
