import { z } from "zod";

const getPackSchema = z.object({
  id: z.string(),
});

export type GetPackValues = z.infer<typeof getPackSchema>;

export default getPackSchema;
