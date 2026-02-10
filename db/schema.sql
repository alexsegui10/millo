-- OFM Agency Hub - PostgreSQL Schema
-- Auto-generated from Prisma schema

-- Enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'VIEWER');
CREATE TYPE "ModelStatus" AS ENUM ('ACTIVE', 'PENDING', 'PAUSED', 'ARCHIVED');
CREATE TYPE "NicheStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE "PostType" AS ENUM ('REEL', 'POST', 'STORY');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'POSTED');
CREATE TYPE "IdeaStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- Users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Models table
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "status" "ModelStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- Niches table (Instagram accounts)
CREATE TABLE "Niche" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "nicheName" TEXT NOT NULL,
    "instagramHandle" TEXT NOT NULL,
    "bio" TEXT,
    "status" "NicheStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Niche_pkey" PRIMARY KEY ("id")
);

-- Assets table
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "tags" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- ContentPost table
CREATE TABLE "ContentPost" (
    "id" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "caption" TEXT,
    "hook" TEXT,
    "theme" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPost_pkey" PRIMARY KEY ("id")
);

-- PostAsset junction table
CREATE TABLE "PostAsset" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostAsset_pkey" PRIMARY KEY ("id")
);

-- PostMetric table
CREATE TABLE "PostMetric" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "followersGained" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostMetric_pkey" PRIMARY KEY ("id")
);

-- AccountMetricsDaily table
CREATE TABLE "AccountMetricsDaily" (
    "id" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "profileVisits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AccountMetricsDaily_pkey" PRIMARY KEY ("id")
);

-- Idea table
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "description" TEXT,
    "format" TEXT,
    "status" "IdeaStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- Unique Constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Niche_instagramHandle_key" ON "Niche"("instagramHandle");
CREATE UNIQUE INDEX "PostAsset_postId_assetId_key" ON "PostAsset"("postId", "assetId");
CREATE UNIQUE INDEX "PostMetric_postId_date_key" ON "PostMetric"("postId", "date");
CREATE UNIQUE INDEX "AccountMetricsDaily_nicheId_date_key" ON "AccountMetricsDaily"("nicheId", "date");

-- Foreign Keys
ALTER TABLE "Niche" ADD CONSTRAINT "Niche_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostAsset" ADD CONSTRAINT "PostAsset_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostAsset" ADD CONSTRAINT "PostAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostMetric" ADD CONSTRAINT "PostMetric_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountMetricsDaily" ADD CONSTRAINT "AccountMetricsDaily_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes for performance
CREATE INDEX "Niche_modelId_idx" ON "Niche"("modelId");
CREATE INDEX "Asset_nicheId_idx" ON "Asset"("nicheId");
CREATE INDEX "ContentPost_nicheId_idx" ON "ContentPost"("nicheId");
CREATE INDEX "PostAsset_postId_idx" ON "PostAsset"("postId");
CREATE INDEX "PostAsset_assetId_idx" ON "PostAsset"("assetId");
CREATE INDEX "PostMetric_postId_idx" ON "PostMetric"("postId");
CREATE INDEX "AccountMetricsDaily_nicheId_idx" ON "AccountMetricsDaily"("nicheId");
CREATE INDEX "Idea_nicheId_idx" ON "Idea"("nicheId");
