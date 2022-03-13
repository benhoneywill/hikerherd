import { z } from "zod";

const getUserSchema = z.object({
  username: z.string(),
});

export default getUserSchema;
