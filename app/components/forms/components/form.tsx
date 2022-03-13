import type { FormComponent } from "../types/form-component";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";

const Form: FormComponent = ({
  schema,
  initialValues,
  onSubmit,
  render,
  ...props
}) => {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={(form) => (
        <form onSubmit={form.handleSubmit} {...props}>
          {render(form)}
        </form>
      )}
    />
  );
};

export default Form;
