import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

/**
 * Configure the connection string from environment variables.
 */
const connectionString = `${process.env.DATABASE_URL}`;

/**
 * Initialize the Prisma adapter for PostgreSQL.
 */
const adapter = new PrismaPg({ connectionString });

/**
 * Prisma Client Singleton Pattern.
 * This ensures that only one instance of the Prisma client is created even during
 * Hot Module Replacement (HMR) in development.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
