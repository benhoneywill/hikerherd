import { z } from "zod";

const paginationSchema = z.object({
  skip: z.number().optional().default(0),
  take: z.number().optional().default(12),
});

export type paginationValues = z.infer<typeof paginationSchema>;

export default paginationSchema;
