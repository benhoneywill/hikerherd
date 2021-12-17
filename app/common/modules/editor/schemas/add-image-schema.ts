import { z } from "zod";

const addImageSchema = z.object({
  image: z.string(),
});

export type AddImageValues = z.infer<typeof addImageSchema>;

export default addImageSchema;
