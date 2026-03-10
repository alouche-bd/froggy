-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('STRIPE', 'GALAXY');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('SUCCESS', 'ERROR', 'SKIPPED');

-- CreateTable
CREATE TABLE "IntegrationLog" (
    "id" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "action" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL,
    "orderId" TEXT,
    "stripeEventId" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "request" JSONB,
    "response" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntegrationLog_provider_action_orderId_idx" ON "IntegrationLog"("provider", "action", "orderId");

-- CreateIndex
CREATE INDEX "IntegrationLog_createdAt_idx" ON "IntegrationLog"("createdAt");
