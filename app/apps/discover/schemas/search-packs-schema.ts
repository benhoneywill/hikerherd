import { z } from "zod";

const searchPacksSchema = z.object({
  query: z.string(),
});

export default searchPacksSchema;
