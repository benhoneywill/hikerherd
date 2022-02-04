import { z } from "zod";

const passwordSchema = z.string().min(8).max(100);

export default passwordSchema;
