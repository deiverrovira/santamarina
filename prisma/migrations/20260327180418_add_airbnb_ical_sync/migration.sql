-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "airbnbIcsUrl" TEXT,
ADD COLUMN     "lastSyncAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UnavailableDate" (
    "id" SERIAL NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'airbnb_ical',
    "externalUid" TEXT,

    CONSTRAINT "UnavailableDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UnavailableDate_apartmentId_date_idx" ON "UnavailableDate"("apartmentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UnavailableDate_apartmentId_date_source_key" ON "UnavailableDate"("apartmentId", "date", "source");

-- AddForeignKey
ALTER TABLE "UnavailableDate" ADD CONSTRAINT "UnavailableDate_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
