import type { FC } from "react";
import type { CategoryType } from "db";

import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";
import { z } from "zod";
import { Stack, Text, Link } from "@chakra-ui/layout";

import ModalForm from "app/components/forms/components/modal-form";
import FileField from "app/components/forms/components/file-field";
import readFile from "app/helpers/read-file";
import PrismaError from "app/errors/prisma-error";

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
      onSubmit={async ({ file }) => {
        if (!file) {
          return {
            [FORM_ERROR]: "A file is required.",
          };
        }

        try {
          const target = await readFile(file);
          await importCsv({ file: target.result, type });
          onClose();

          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          if (error instanceof CsvImportError) {
            return { [FORM_ERROR]: error.errors };
          } else if (error instanceof PrismaError) {
            return { [FORM_ERROR]: error.message };
          } else {
            return {
              [FORM_ERROR]:
                "Sorry, there was an unexpected error. Please try again.",
            };
          }
        }
      }}
      render={() => (
        <Stack spacing={6}>
          <Text>
            When you import gear it will be appended to what you already have.
            Nothing will be deleted or modified.
          </Text>
          <Text>
            <strong>Your CSV file must be in the correct format.</strong>{" "}
            <Link
              href="https://docs.google.com/spreadsheets/d/1WoYCmv7nu9M1f-PMVqdQ1Za0FTyHvKJxWcJtww9r6II/edit?usp=sharing"
              isExternal
              textDecoration="underline"
            >
              View the example spreadsheet
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
