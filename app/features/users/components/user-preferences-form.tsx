import type { BlitzPage } from "blitz";

import { useMutation } from "blitz";
import { Fragment } from "react";

import { useToast } from "@chakra-ui/react";
import { FORM_ERROR } from "final-form";

import SimpleForm from "app/modules/forms/components/simple-form";
import SelectField from "app/modules/forms/components/select-field";

import { Currency, WeightUnit } from "db";

import useCurrentUser from "../hooks/use-current-user";
import updatePreferencesSchema from "../schemas/update-preferences-schema";
import updatePreferencesMutation from "../mutations/update-preferences-mutation";

const UserPreferencesForm: BlitzPage = () => {
  const user = useCurrentUser();
  const toast = useToast();
  const [updatePreferences] = useMutation(updatePreferencesMutation);

  return (
    <SimpleForm
      schema={updatePreferencesSchema}
      initialValues={{ weightUnit: user?.weightUnit }}
      submitText="Save preferences"
      onSubmit={async (values) => {
        try {
          await updatePreferences(values);
          toast({
            title: "Preferences updated.",
            description: "Your new user preferences have been saved.",
            status: "success",
          });
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Sorry, there was an unexpected error. Please try again.",
          };
        }
      }}
      render={() => (
        <Fragment>
          <SelectField name="weightUnit" label="Weight units">
            <option value={WeightUnit.METRIC}>Metric (g / kg)</option>
            <option value={WeightUnit.IMPERIAL}>Imperial (oz / lb)</option>
          </SelectField>

          <SelectField name="currency" label="Currency">
            <option value={Currency.USD}>Dollars ($)</option>
            <option value={Currency.GBP}>Pounds (£)</option>
            <option value={Currency.EUR}>Euros (€)</option>
          </SelectField>
        </Fragment>
      )}
    />
  );
};

export default UserPreferencesForm;
