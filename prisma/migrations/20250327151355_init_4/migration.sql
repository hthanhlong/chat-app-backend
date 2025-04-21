/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;
