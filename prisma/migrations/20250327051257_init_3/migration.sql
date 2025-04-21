/*
  Warnings:

  - You are about to drop the column `friend_id` on the `friend_ships` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `friend_ships` table. All the data in the column will be lost.
  - Added the required column `user_id_1` to the `friend_ships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id_2` to the `friend_ships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "friend_ships" DROP COLUMN "friend_id",
DROP COLUMN "user_id",
ADD COLUMN     "user_id_1" INTEGER NOT NULL,
ADD COLUMN     "user_id_2" INTEGER NOT NULL;
