/*
  Warnings:

  - The values [VIDEO_EDITING,DATA_SCIENCE,EMBEDDED_SYSTEMS_ROBOTICS] on the enum `InternshipTrack` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InternshipTrack_new" AS ENUM ('FRONT_END_WEB_DEVELOPMENT', 'BACK_END_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'UI_UX_DESIGN', 'DATA_ANALYTICS');
ALTER TABLE "Applicant" ALTER COLUMN "track" TYPE "InternshipTrack_new" USING ("track"::text::"InternshipTrack_new");
ALTER TYPE "InternshipTrack" RENAME TO "InternshipTrack_old";
ALTER TYPE "InternshipTrack_new" RENAME TO "InternshipTrack";
DROP TYPE "public"."InternshipTrack_old";
COMMIT;
