import type { ZodString } from "zod";

import { z } from "zod";

const trimString = (u: unknown) => (typeof u === "string" ? u.trim() : u);

export const trimmedStringSchema = (schema: ZodString) =>
  z.preprocess(trimString, schema);

const requiredStringSchema = (message: string = "This is required") =>
  z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .nonempty(message);

export default requiredStringSchema;
