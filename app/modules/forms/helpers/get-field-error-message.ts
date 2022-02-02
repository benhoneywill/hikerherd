import type { FieldMetaState } from "react-final-form";

const getFieldErrorMessage = (meta: FieldMetaState<any>) => {
  const { error, submitError } = meta;
  return Array.isArray(error) ? error.join(", ") : error || submitError;
};

export default getFieldErrorMessage;
