import { z } from "zod";

const toggleConsumableSchema = z.object({
  id: z.string(),
});

export type ToggleConsumableValues = z.infer<typeof toggleConsumableSchema>;

export default toggleConsumableSchema;
