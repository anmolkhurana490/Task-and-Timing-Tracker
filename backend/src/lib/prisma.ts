import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

import dotenv from "dotenv";
dotenv.config({ quiet: true });

if (!process.env["DATABASE_URL"]) {
  throw new Error("DATABASE_URL is not configured");
}

/** Creates the shared Prisma client used by backend modules. */
const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"]
});

export const prisma = new PrismaClient({ adapter });