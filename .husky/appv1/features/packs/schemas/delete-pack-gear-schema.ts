import { z } from "zod";

const deletePackGearSchema = z.object({
  id: z.string(),
});

export type DeletePackGearValues = z.infer<typeof deletePackGearSchema>;

export default deletePackGearSchema;
