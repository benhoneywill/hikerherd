import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const passwordSchema = requiredStringSchema().min(8).max(100);

export default passwordSchema;
