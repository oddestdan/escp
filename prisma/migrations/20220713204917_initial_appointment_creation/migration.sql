-- CreateTable
CREATE TABLE "Appointment" (
    "appId" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
