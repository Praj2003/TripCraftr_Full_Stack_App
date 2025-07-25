/*
  Warnings:

  - You are about to drop the column `email` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_email_fkey";

-- DropIndex
DROP INDEX "subscription_email_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "email",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userEmail_key" ON "subscription"("userEmail");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
