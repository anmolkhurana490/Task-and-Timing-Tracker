-- Store only a one-way password hash, never the user's raw password.
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';

-- Remove the temporary default so future rows must provide a hash explicitly.
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;