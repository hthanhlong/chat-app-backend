/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `receiver_uuid` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_uuid` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "receiver_id",
DROP COLUMN "sender_id",
ADD COLUMN     "receiver_uuid" TEXT NOT NULL,
ADD COLUMN     "sender_uuid" TEXT NOT NULL;
