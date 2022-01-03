import { z } from "zod";

const searchGearSchema = z.object({
  query: z.string(),
});

export type SearchGearValues = z.infer<typeof searchGearSchema>;

export default searchGearSchema;
