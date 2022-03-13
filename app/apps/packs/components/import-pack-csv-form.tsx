import type { FC } from "react";

import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";
import { z } from "zod";
import { Stack, Text, Link, HStack } from "@chakra-ui/layout";
import { FaList } from "react-icons/fa";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";

import ModalForm from "app/components/forms/components/modal-form";
import FileField from "app/components/forms/components/file-field";
import CsvImportError from "app/apps/inventory/errors/csv-import-error";
import CheckboxField from "app/components/forms/components/checkbox-field";
import readFile from "app/helpers/read-file";

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
      onSubmit={async ({ file, addToInventory }) => {
        if (!file) {
          return {
            [FORM_ERROR]: "A file is required.",
          };
        }

        try {
          const target = await readFile(file);
          await importCsv({ file: target.result, id: packId, addToInventory });
          onClose();

          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          if (error instanceof CsvImportError) {
            return { [FORM_ERROR]: error.errors };
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
              href="https://blog.hikerherd.com/the-csv-import-guide/"
              isExternal
              textDecoration="underline"
            >
              Read the importing guide
            </Link>{" "}
            for more details.
          </Text>
          <FileField name="file" label="CSV file" accept="text/csv" />
          <HStack>
            <Tag colorScheme="blue" flexShrink="0">
              <TagLeftIcon as={FaList} />
              <TagLabel>Also import to inventory?</TagLabel>
            </Tag>
            <CheckboxField name="addToInventory" />
          </HStack>
        </Stack>
      )}
    />
  );
};

export default ImportPackCsvForm;
