import type { FC } from "react";
import type { Pack } from "db";
import type { CreatePackValues } from "../schemas/create-pack-schema";
import type { CreatePackResult } from "../mutations/create-pack-mutation";
import type { UpdatePackResult } from "../mutations/update-pack-mutation";

import { useMutation } from "blitz";

import { Stack, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";
import EditorField from "app/modules/editor/components/editor-field";

import createPackMutation from "../mutations/create-pack-mutation";
import createPackSchema from "../schemas/create-pack-schema";
import updatePackMutation from "../mutations/update-pack-mutation";

type PackFormProps = {
  pack?: Pick<Pack, "id" | "name" | "notes">;
  onSuccess?: (pack: CreatePackResult | UpdatePackResult) => void;
};

const PackForm: FC<PackFormProps> = ({ pack, onSuccess }) => {
  const [createPack] = useMutation(createPackMutation);
  const [updatePack] = useMutation(updatePackMutation);

  const initialValues = {
    name: pack ? pack.name : "",
    notes: pack?.notes ? JSON.parse(pack.notes) : null,
  };

  const handleSubmit = async (values: CreatePackValues) => {
    try {
      let result;

      if (pack) {
        result = await updatePack({ id: pack.id, ...values });
      } else {
        result = await createPack(values);
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
      schema={createPackSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <Stack spacing={4}>
          <Stack spacing={3}>
            <TextField name="name" label="Name" placeholder="Name your pack" />
            <EditorField
              name="notes"
              fontSize="md"
              label="Pack notes"
              features={{
                image: true,
                blockquote: true,
                heading: true,
                horizontalRule: true,
              }}
              barMenu
              bubbleMenu
              floatingMenu
            />
          </Stack>

          <HStack justify="flex-end">
            <Button
              isLoading={form.submitting}
              colorScheme="green"
              type="submit"
            >
              {pack ? "Update pack" : "Create pack"}
            </Button>
          </HStack>
        </Stack>
      )}
    />
  );
};

export default PackForm;
