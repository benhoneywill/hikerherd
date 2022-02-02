import { z } from "zod";

const addGearToPackSchema = z.object({
  categoryId: z.string(),
  gearId: z.string(),
});

export default addGearToPackSchema;
