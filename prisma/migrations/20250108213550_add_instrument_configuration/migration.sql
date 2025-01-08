/*
  Warnings:

  - You are about to drop the column `pair` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `instrument` to the `Journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrumentValue` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "instrument" TEXT NOT NULL,
ADD COLUMN     "instrumentOptions" TEXT[];

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "pair",
ADD COLUMN     "instrumentValue" TEXT NOT NULL;
