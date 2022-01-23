import { z } from "zod";

const addGearToPackSchema = z.object({
  packId: z.string(),
  categoryId: z.string(),
  gearId: z.string(),
});

export default addGearToPackSchema;
