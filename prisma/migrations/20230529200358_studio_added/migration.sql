/*
  Warnings:

  - Added the required column `studio` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studio" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "price" TEXT NOT NULL DEFAULT '0',
    "services" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Appointment" ("confirmed", "contactInfo", "createdAt", "date", "id", "price", "services", "timeFrom", "timeTo", "updatedAt") SELECT "confirmed", "contactInfo", "createdAt", "date", "id", "price", "services", "timeFrom", "timeTo", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
