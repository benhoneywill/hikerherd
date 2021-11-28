import { z } from "zod";

const getMyPostSchema = z.object({
  id: z.number().positive(),
});

export type GetMyPostParams = z.infer<typeof getMyPostSchema>;

export default getMyPostSchema;
