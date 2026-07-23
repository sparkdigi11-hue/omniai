-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
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
    CONSTRAINT "Call_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
