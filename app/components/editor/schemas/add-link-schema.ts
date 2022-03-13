import { z } from "zod";

const addLinkSchema = z.object({
  link: z.string().url().nullable().default(null),
});

export default addLinkSchema;
