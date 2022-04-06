import requiredStringSchema, {
  trimmedStringSchema,
} from "app/schemas/required-string-schema";

const passwordSchema = trimmedStringSchema(
  requiredStringSchema().min(8).max(100)
);

export default passwordSchema;
