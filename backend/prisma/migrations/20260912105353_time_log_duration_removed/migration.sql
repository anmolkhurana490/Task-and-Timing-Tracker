/*
  Warnings:

  - You are about to drop the column `duration` on the `TimeLog` table. All the data in the column will be lost.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "duration";
