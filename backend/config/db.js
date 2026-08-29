import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not set. Skipping Prisma connection for now.');
    return;
  }

  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL / Supabase Database Connected via Prisma');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
};

export default prisma;