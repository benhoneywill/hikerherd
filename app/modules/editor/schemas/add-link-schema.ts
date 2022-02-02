import { z } from "zod";

const addLinkSchema = z.object({
  link: z.string().nullable().default(""),
});

export default addLinkSchema;
