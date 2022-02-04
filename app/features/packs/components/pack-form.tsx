import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment } from "react";
import { useQuery, useMutation } from "blitz";

import { Center } from "@chakra-ui/layout";
import { FORM_ERROR } from "final-form";
import { Spinner } from "@chakra-ui/spinner";

import TextField from "app/modules/forms/components/text-field";
import EditorField from "app/modules/editor/components/editor-field";
import ModalForm from "app/modules/forms/components/modal-form";

import createPackMutation from "../mutations/create-pack-mutation";
import createPackSchema from "../schemas/create-pack-schema";
import updatePackMutation from "../mutations/update-pack-mutation";
import packQuery from "../queries/pack-query";

type PackFormProps = {
  packId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (
    pack: PromiseReturnType<
      typeof createPackMutation | typeof updatePackMutation
    >
  ) => void;
};

const PackForm: FC<PackFormProps> = ({
  packId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createPack] = useMutation(createPackMutation);
  const [updatePack] = useMutation(updatePackMutation);

  const [pack, { isLoading }] = useQuery(
    packQuery,
    { id: packId },
    { suspense: false, enabled: !!packId }
  );

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      schema={createPackSchema}
      title={packId ? "Update pack" : "Create a new pack"}
      submitText={packId ? "Update" : "Create"}
      initialValues={{
        name: pack ? pack.name : "",
        notes: pack?.notes ? JSON.parse(pack.notes) : null,
      }}
      onSubmit={async (values) => {
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
            [FORM_ERROR]:
              "Sorry, there was an unexpected error. Please try again.",
          };
        }
      }}
      render={() => (
        <Fragment>
          {isLoading ? (
            <Center p={3}>
              <Spinner />
            </Center>
          ) : (
            <Fragment>
              <TextField
                name="name"
                label="Name"
                placeholder="Name your pack"
              />
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
            </Fragment>
          )}
        </Fragment>
      )}
    />
  );
};

export default PackForm;
