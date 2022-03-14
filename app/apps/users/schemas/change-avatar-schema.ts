import { z } from "zod";

const changeAvatarSchema = z.object({
  avatar: z.string(),
});

export default changeAvatarSchema;
