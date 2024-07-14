/*
  Warnings:

  - You are about to drop the column `content_desc` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `content_info_id` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `content_type` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `content_url` on the `Content` table. All the data in the column will be lost.
  - Added the required column `mediaId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_content_info_id_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "content_desc",
DROP COLUMN "content_info_id",
DROP COLUMN "content_type",
DROP COLUMN "content_url",
ADD COLUMN     "ctype" "Content Type" NOT NULL DEFAULT 'image',
ADD COLUMN     "desc" TEXT,
ADD COLUMN     "informationId" INTEGER,
ADD COLUMN     "mediaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
