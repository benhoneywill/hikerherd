import { z } from "zod";

const deleteGearSchema = z.object({
  id: z.string(),
});

export type DeleteGearValues = z.infer<typeof deleteGearSchema>;

export default deleteGearSchema;
