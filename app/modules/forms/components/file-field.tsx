import type { ComponentPropsWithoutRef, MutableRefObject } from "react";

import { useRef, forwardRef } from "react";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Icon } from "@chakra-ui/icon";
import { FaFile } from "react-icons/fa";
import { useField } from "react-final-form";

import getFieldErrorMessage from "../helpers/get-field-error-message";

type FileFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  name: string;
  label: string;
};

const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  ({ name, label, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      input: { value, ...input },
      meta,
    } = useField<File | null>(name, {
      type: "file",
    });

    const error = getFieldErrorMessage(meta);

    return (
      <FormControl isInvalid={meta.touched && error} isRequired>
        <FormLabel htmlFor="writeUpFile">{label}</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaFile} color="gray.400" />
          </InputLeftElement>
          <input
            {...input}
            onChange={({ target }) =>
              input.onChange(target.files && target.files[0])
            }
            disabled={meta.submitting}
            type="file"
            name={name}
            ref={(node) => {
              (inputRef as MutableRefObject<HTMLInputElement | null>).current =
                node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            {...props}
            style={{ display: "none" }}
          ></input>
          <Input
            placeholder="Select your file..."
            onClick={() => inputRef?.current?.click()}
            variant="filled"
            cursor="pointer"
            readOnly
            value={value?.name || ""}
          />
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default FileField;
