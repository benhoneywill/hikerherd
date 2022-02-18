import type { FC } from "react";

import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";
import { z } from "zod";
import { Stack, Text, Link, HStack } from "@chakra-ui/layout";
import { FaList } from "react-icons/fa";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";

import ModalForm from "app/modules/forms/components/modal-form";
import FileField from "app/modules/forms/components/file-field";
import CsvImportError from "app/features/inventory/errors/csv-import-error";
import CheckboxField from "app/modules/forms/components/checkbox-field";

import packImportCsvMutation from "../mutations/pack-import-csv-mutation";
import packImportCsvSchema from "../schemas/pack-import-csv-schema";

type ImportPackCsvFormProps = {
  packId: string;
  onSuccess?: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const ImportPackCsvForm: FC<ImportPackCsvFormProps> = ({
  packId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [importCsv] = useMutation(packImportCsvMutation);

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Import from CSV"
      schema={packImportCsvSchema.extend({ file: z.any() })}
      submitText="Import"
      initialValues={{ id: packId, addToInventory: false }}
      onSubmit={({ file, addToInventory }) => {
        console.log(file);
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
                await importCsv({
                  file: target.result,
                  id: packId,
                  addToInventory,
                });

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
          <HStack>
            <Tag colorScheme="blue" flexShrink="0">
              <TagLeftIcon as={FaList} />
              <TagLabel>Add to inventory?</TagLabel>
            </Tag>
            <CheckboxField name="addToInventory" />
          </HStack>
          <Text>
            If you already have these items in your inventory this option will
            create duplicates
          </Text>
        </Stack>
      )}
    />
  );
};

export default ImportPackCsvForm;
