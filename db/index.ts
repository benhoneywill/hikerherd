import { enhancePrisma } from "blitz";

import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const EnhancedPrisma = enhancePrisma(PrismaClient);

export default new EnhancedPrisma();
