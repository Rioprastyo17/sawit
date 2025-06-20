-- CreateTable
CREATE TABLE "PalmOilPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "source" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PalmOilPrice_date_key" ON "PalmOilPrice"("date");
