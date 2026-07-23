-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Call" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "orderId" TEXT,
    "customer" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "aiEmployee" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "duration" TEXT NOT NULL DEFAULT '00:00',
    "transcript" TEXT,
    "summary" TEXT,
    "recordingUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Call_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Call_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Call" ("aiEmployee", "createdAt", "customer", "duration", "id", "phone", "product", "recordingUrl", "status", "summary", "transcript", "updatedAt", "workspaceId") SELECT "aiEmployee", "createdAt", "customer", "duration", "id", "phone", "product", "recordingUrl", "status", "summary", "transcript", "updatedAt", "workspaceId" FROM "Call";
DROP TABLE "Call";
ALTER TABLE "new_Call" RENAME TO "Call";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
