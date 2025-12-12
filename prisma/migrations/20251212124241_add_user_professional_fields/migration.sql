-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "professionalAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "siret" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "specialty" TEXT NOT NULL DEFAULT 'autres',
ADD COLUMN     "training" TEXT NOT NULL DEFAULT 'commit',
ADD COLUMN     "usedFroggymouth" BOOLEAN NOT NULL DEFAULT false;
