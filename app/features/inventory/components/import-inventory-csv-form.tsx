import type { FC } from "react";
import type { CategoryType } from "db";

import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";
import { z } from "zod";
import { Stack, Text, Link } from "@chakra-ui/layout";

import ModalForm from "app/modules/forms/components/modal-form";
import FileField from "app/modules/forms/components/file-field";

import inventoryImportCsvMutation from "../mutations/inventory-import-csv-mutation";
import CsvImportError from "../errors/csv-import-error";

type ImportInventoryCsvFormProps = {
  type: CategoryType;
  onSuccess?: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const ImportInventoryCsvForm: FC<ImportInventoryCsvFormProps> = ({
  type,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [importCsv] = useMutation(inventoryImportCsvMutation);

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Import from CSV"
      schema={z.object({ file: z.any() })}
      submitText="Import"
      initialValues={{}}
      onSubmit={({ file }) => {
        if (!file) {
          return {
            [FORM_ERROR]: "A file is required.",
          };
        }

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsText(file);

          reader.addEventListener("load", async ({ target }) => {
            if (target?.result) {
              try {
                await importCsv({ file: target.result, type });

                onClose();

                if (onSuccess) {
                  onSuccess();
                }

                resolve(undefined);
              } catch (error) {
                if (error instanceof CsvImportError) {
                  resolve({ [FORM_ERROR]: error.errors });
                } else {
                  resolve({
                    [FORM_ERROR]:
                      "Sorry, there was an unexpected error. Please try again.",
                  });
                }
              }
            }
          });

          reader.addEventListener("error", () => {
            resolve({
              [FORM_ERROR]:
                "Sorry, there was an unexpected error. Please try again.",
            });
          });
        });
      }}
      render={() => (
        <Stack spacing={6}>
          <Text>
            When you import gear it will be appended to what you already have.
            Nothing will be deleted or modified.
          </Text>
          <Text>
            <strong>Your CSV file must be in the correct format.</strong>{" "}
            <Link href="#" isExternal textDecoration="underline">
              Read the importing guide
            </Link>{" "}
            for more details.
          </Text>
          <FileField name="file" label="CSV file" accept="text/csv" />
        </Stack>
      )}
    />
  );
};

export default ImportInventoryCsvForm;
