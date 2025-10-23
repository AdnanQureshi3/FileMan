
import { PrismaClient } from '@prisma/client';

// 1. Initialize the client
const prisma = new PrismaClient({
    // Optional: Log all SQL queries to the console during development
    log: ['query', 'info', 'warn', 'error'],
});

export default prisma;