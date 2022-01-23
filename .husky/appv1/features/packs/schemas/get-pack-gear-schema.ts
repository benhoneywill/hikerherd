import { z } from "zod";

const getPackGearSchema = z.object({
  id: z.string(),
});

export type GetPackGearValues = z.infer<typeof getPackGearSchema>;

export default getPackGearSchema;
