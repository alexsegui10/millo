-- Create admin user
INSERT INTO "User" ("id", "email", "passwordHash", "fullName", "role", "createdAt", "updatedAt") 
VALUES (
    'admin_user_001',
    'admin@ofmagency.com',
    '$2b$10$rKJ5kGZ8vKxQ6h2Z.3wqOuw3nYP7Nc3zH5aBqV9xF1aE4lKZGm.0m',
    'Admin User',
    'ADMIN',
    NOW(),
    NOW()
) ON CONFLICT ("email") DO UPDATE SET
    "passwordHash" = '$2b$10$rKJ5kGZ8vKxQ6h2Z.3wqOuw3nYP7Nc3zH5aBqV9xF1aE4lKZGm.0m',
    "updatedAt" = NOW();
