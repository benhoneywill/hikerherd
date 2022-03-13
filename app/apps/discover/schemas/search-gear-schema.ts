import { z } from "zod";

const searchGearSchema = z.object({
  query: z.string(),
});

export default searchGearSchema;
