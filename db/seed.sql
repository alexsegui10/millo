-- OFM Agency Hub - Seed Data
-- Admin user + demo data for complete UI testing

-- Admin User
-- Password: admin123 (hashed with bcrypt, 10 rounds)
INSERT INTO "User" ("id", "email", "passwordHash", "fullName", "role", "createdAt", "updatedAt") 
VALUES (
    'user_admin_001',
    'admin@ofmagency.com',
    '$2b$10$rKJ5kGZ8vKxQ6h2Z.3wqOuw3nYP7Nc3zH5aBqV9xF1aE4lKZGm.0m',
    'Admin User',
    'ADMIN',
    NOW(),
    NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Model 1: Fitness Model
INSERT INTO "Model" ("id", "fullName", "status", "notes", "createdAt", "updatedAt")
VALUES (
    'model_001',
    'Ana Martinez',
    'ACTIVE',
    'Main fitness content creator. Focus on workout routines and nutrition.',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Niche 1: Fitness Account
INSERT INTO "Niche" ("id", "modelId", "nicheName", "instagramHandle", "bio", "status", "createdAt", "updatedAt")
VALUES (
    'niche_001',
    'model_001',
    'Fitness & Wellness',
    'ana_fit_wellness',
    'Transform your body and mind. Daily workout tips, nutrition advice, and wellness content.',
    'ACTIVE',
    NOW(),
    NOW()
) ON CONFLICT ("instagramHandle") DO NOTHING;

-- Niche 2: Lifestyle Account
INSERT INTO "Niche" ("id", "modelId", "nicheName", "instagramHandle", "bio", "status", "createdAt", "updatedAt")
VALUES (
    'niche_002',
    'model_001',
    'Lifestyle Vlog',
    'ana_lifestyle',
    'Behind the scenes of a fitness creator. Travel, food, and daily life.',
    'ACTIVE',
    NOW(),
    NOW()
) ON CONFLICT ("instagramHandle") DO NOTHING;

-- Assets for Niche 1
INSERT INTO "Asset" ("id", "nicheId", "type", "url", "tags", "notes", "createdAt", "updatedAt")
VALUES 
(
    'asset_001',
    'niche_001',
    'VIDEO',
    'https://drive.google.com/file/d/example_workout_video_1',
    ARRAY['workout', 'gym', 'legs'],
    'Leg day workout routine - 45 minutes',
    NOW(),
    NOW()
),
(
    'asset_002',
    'niche_001',
    'IMAGE',
    'https://drive.google.com/file/d/example_image_transformation',
    ARRAY['transformation', 'before-after', 'motivation'],
    '3-month transformation client showcase',
    NOW(),
    NOW()
),
(
    'asset_003',
    'niche_001',
    'VIDEO',
    'https://drive.google.com/file/d/example_nutrition_video',
    ARRAY['nutrition', 'meal-prep', 'healthy'],
    'Weekly meal prep guide for muscle gain',
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Content Posts (Fixing missing values if any)
INSERT INTO "ContentPost" ("id", "nicheId", "type", "status", "caption", "hook", "theme", "scheduledAt", "postedAt", "createdAt", "updatedAt")
VALUES 
(
    'post_001',
    'niche_001',
    'REEL',
    'POSTED',
    'Leg day done right! Try this killer workout routine. Save this for your next gym session. #fitness #workout #legday',
    'Transform Your Legs in 30 Days',
    'Workout Routine',
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '5 days',
    NOW()
),
(
    'post_002',
    'niche_001',
    'POST',
    'SCHEDULED',
    'Your weekly meal prep made easy! High protein, balanced macros, delicious taste. Comment RECIPE for the full guide. #mealprep #nutrition #healthy',
    'Meal Prep Like a Pro',
    'Nutrition Guide',
    NOW() + INTERVAL '2 days',
    NULL,
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT DO NOTHING;

-- Link Assets to Posts with orderIndex
INSERT INTO "PostAsset" ("id", "postId", "assetId", "orderIndex")
VALUES 
(
    'pa_001',
    'post_001',
    'asset_001',
    0
),
(
    'pa_002',
    'post_002',
    'asset_003',
    0
) ON CONFLICT ("postId", "assetId") DO NOTHING;

-- Post Metrics (Using DATE casting)
INSERT INTO "PostMetric" ("id", "postId", "date", "views", "likes", "comments", "saves", "shares", "followersGained")
VALUES (
    'metric_001',
    'post_001',
    (NOW() - INTERVAL '2 days')::DATE,
    15420,
    1256,
    89,
    542,
    127,
    34
) ON CONFLICT DO NOTHING;

-- Daily Account Metrics (Using DATE casting)
INSERT INTO "AccountMetricsDaily" ("id", "nicheId", "date", "followers", "reach", "impressions", "profileVisits")
VALUES 
(
    'daily_001',
    'niche_001',
    NOW()::DATE,
    12450,
    8920,
    15340,
    542
),
(
    'daily_002',
    'niche_001',
    (NOW() - INTERVAL '1 day')::DATE,
    12416,
    7830,
    14210,
    489
),
(
    'daily_003',
    'niche_001',
    (NOW() - INTERVAL '2 days')::DATE,
    12382,
    9140,
    16450,
    621
),
(
    'daily_004',
    'niche_001',
    (NOW() - INTERVAL '3 days')::DATE,
    12348,
    8560,
    15780,
    567
),
(
    'daily_005',
    'niche_001',
    (NOW() - INTERVAL '4 days')::DATE,
    12314,
    7920,
    14920,
    512
),
(
    'daily_006',
    'niche_001',
    (NOW() - INTERVAL '5 days')::DATE,
    12280,
    8340,
    15120,
    534
),
(
    'daily_007',
    'niche_001',
    (NOW() - INTERVAL '6 days')::DATE,
    12246,
    7650,
    13890,
    498
) ON CONFLICT DO NOTHING;

-- Content Ideas
INSERT INTO "Idea" ("id", "nicheId", "hook", "description", "format", "status", "createdAt", "updatedAt")
VALUES 
(
    'idea_001',
    'niche_001',
    '5 Mistakes Killing Your Gains',
    'Common gym mistakes that prevent muscle growth. Cover form, rest, nutrition, overtraining, and hydration.',
    'Carousel',
    'IN_PROGRESS',
    NOW() - INTERVAL '2 days',
    NOW()
),
(
    'idea_002',
    'niche_001',
    'Morning Routine of a Fitness Creator',
    'Show full morning routine from wake up to first meal. Include workout, supplements, and mindset practices.',
    'Reel',
    'NEW',
    NOW() - INTERVAL '1 day',
    NOW()
) ON CONFLICT DO NOTHING;
