import { z } from "zod";

const requiredStringSchema = (message: string = "This is required") =>
  z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .nonempty(message);

export default requiredStringSchema;
