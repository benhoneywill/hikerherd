import { z } from "zod";

const searchGearSchema = z.object({
  query: z.string(),
  maxWeight: z.number().optional(),
  minWeight: z.number().optional(),
});

export default searchGearSchema;
