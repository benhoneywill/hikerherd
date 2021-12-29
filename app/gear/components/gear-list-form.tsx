import type { FC } from "react";
import type { GearList } from "db";
import type { CreateGearListValues } from "../schemas/create-gear-list-schema";
import type { CreateGearListResult } from "../mutations/create-gear-list-mutation";
import type { UpdateGearListResult } from "../mutations/update-gear-list-mutation";

import { useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import createGearListMutation from "../mutations/create-gear-list-mutation";
import createGearListSchema from "../schemas/create-gear-list-schema";
import updateGearListMutation from "../mutations/update-gear-list-mutation";

type GearListFormProps = {
  gearList?: Pick<GearList, "id" | "name">;
  onSuccess?: (gearList: CreateGearListResult | UpdateGearListResult) => void;
};

const GearListForm: FC<GearListFormProps> = ({ gearList, onSuccess }) => {
  const [createGearList] = useMutation(createGearListMutation);
  const [updateGearList] = useMutation(updateGearListMutation);

  const initialValues = {
    name: gearList ? gearList.name : "",
  };

  const handleSubmit = async (values: CreateGearListValues) => {
    try {
      let result;

      if (gearList) {
        result = await updateGearList({ id: gearList.id, ...values });
      } else {
        result = await createGearList(values);
      }

      if (onSuccess) onSuccess(result);
    } catch (error: unknown) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <Form
      submitText="Create list"
      schema={createGearListSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Stack>
        <TextField name="name" label="Name" placeholder="Name" />
      </Stack>
    </Form>
  );
};

export default GearListForm;
