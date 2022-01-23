import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default forgotPasswordSchema;
