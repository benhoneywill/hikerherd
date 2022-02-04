import { z } from "zod";

const paginationSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(10),
});

export default paginationSchema;
