import { z } from "zod";

export const passwordSchema = z.string().min(10).max(100);
