-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "price" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "callStatus" TEXT NOT NULL DEFAULT 'Pending',
    "aiSummary" TEXT,
    "notes" TEXT,
    "callbackAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("aiSummary", "callbackAt", "createdAt", "customerId", "id", "notes", "price", "product", "status", "updatedAt", "workspaceId") SELECT "aiSummary", "callbackAt", "createdAt", "customerId", "id", "notes", "price", "product", "status", "updatedAt", "workspaceId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
