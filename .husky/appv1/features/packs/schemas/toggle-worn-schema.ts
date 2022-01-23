import { z } from "zod";

const toggleWornSchema = z.object({
  id: z.string(),
});

export type ToggleWornValues = z.infer<typeof toggleWornSchema>;

export default toggleWornSchema;
