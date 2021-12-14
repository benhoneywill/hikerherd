import { z } from "zod";

const getMyPostSchema = z.object({
  id: z.string(),
});

export type GetMyPostParams = z.infer<typeof getMyPostSchema>;

export default getMyPostSchema;
