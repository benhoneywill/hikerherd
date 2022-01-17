import { z } from "zod";

const newItemSchema = z.object({
  name: z.string().min(1, "Type a name"),
});

export type NewItemValues = z.infer<typeof newItemSchema>;

export default newItemSchema;
