/*
  Warnings:

  - A unique constraint covering the columns `[user_id,exercise_title]` on the table `PR` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PR_exercise_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "PR_user_id_exercise_title_key" ON "PR"("user_id", "exercise_title");
