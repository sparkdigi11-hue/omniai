-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "aiEmployeeId" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'AI',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conversation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversation_aiEmployeeId_fkey" FOREIGN KEY ("aiEmployeeId") REFERENCES "AIEmployee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("aiEmployeeId", "createdAt", "id", "orderId", "updatedAt") SELECT "aiEmployeeId", "createdAt", "id", "orderId", "updatedAt" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
