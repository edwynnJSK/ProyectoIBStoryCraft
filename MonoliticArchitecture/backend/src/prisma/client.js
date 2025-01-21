import { PrismaClient } from '@prisma/client'; // Importar PrismaClient

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
export default prisma; // Exportar la instancia de prisma