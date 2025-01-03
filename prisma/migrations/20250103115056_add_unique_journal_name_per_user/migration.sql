/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Journal_name_userId_key" ON "Journal"("name", "userId");
