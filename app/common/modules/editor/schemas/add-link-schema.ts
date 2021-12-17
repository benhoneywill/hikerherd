import { z } from "zod";

const addLinkSchema = z.object({
  link: z.string().nullable().default(""),
});

export type AddLinkValues = z.infer<typeof addLinkSchema>;

export default addLinkSchema;
