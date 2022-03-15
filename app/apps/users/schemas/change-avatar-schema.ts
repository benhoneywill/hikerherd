import { z } from "zod";

const changeAvatarSchema = z.object({
  publicId: z.string(),
  version: z.number(),
});

export default changeAvatarSchema;
