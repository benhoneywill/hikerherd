import { z } from "zod";

const idSchema = z.object({
  id: z.string(),
});

export default idSchema;
