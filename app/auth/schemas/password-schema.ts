import { z } from "zod";

const passwordSchema = z.string().min(10).max(100);

export type PasswordValues = z.infer<typeof passwordSchema>;

export default passwordSchema;
