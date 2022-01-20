import type { FC } from "react";

import { Stack } from "@chakra-ui/layout";
import {
  FaImage,
  FaLink,
  FaStickyNote,
  FaTag,
  FaHamburger,
  FaWeightHanging,
  FaTshirt,
} from "react-icons/fa";
import {
  Icon,
  HStack,
  Tag,
  TagLeftIcon,
  TagLabel,
  FormLabel,
} from "@chakra-ui/react";

import TextField from "app/common/components/text-field";
import TextAreaField from "app/common/components/text-area-field";
import CheckboxField from "app/common/components/checkbox-field";
import TextDivider from "app/common/components/text-divider";
import SelectField from "app/common/components/select-field";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";

type GearFormFieldsProps = {
  includeWorn?: boolean;
};

const GearFormFields: FC<GearFormFieldsProps> = ({ includeWorn }) => {
  const { weightUnit } = useUserPreferences();

  return (
    <Stack spacing={4}>
      <TextField
        name="name"
        label="Name"
        placeholder="Name"
        controlProps={{ isRequired: true }}
      />
      <TextField
        type="number"
        name="weight"
        label="Weight"
        placeholder="Weight"
        inputRightAddon={weightUnit === "METRIC" ? "g" : "oz"}
        inputLeftElement={<Icon color="teal.400" as={FaWeightHanging} />}
      />

      <FormLabel>Tags</FormLabel>
      <HStack>
        <Tag colorScheme="pink" flexShrink="0">
          <TagLeftIcon as={FaHamburger} />
          <TagLabel>Consumable?</TagLabel>
        </Tag>
        <CheckboxField name="consumable" />
      </HStack>
      {includeWorn && (
        <HStack>
          <Tag colorScheme="blue" flexShrink="0">
            <TagLeftIcon as={FaTshirt} />
            <TagLabel>Worn?</TagLabel>
          </Tag>
          <CheckboxField name="worn" />
        </HStack>
      )}

      <TextDivider>Addons</TextDivider>

      <HStack align="flex-end">
        <TextField
          type="number"
          name="price"
          label="Price"
          placeholder="Price"
          inputLeftElement={<Icon color="purple.400" as={FaTag} />}
        />
        <SelectField name="currency" controlProps={{ flex: "0 0 60px" }}>
          <option value="USD">$</option>
          <option value="GBP">£</option>
          <option value="EUR">€</option>
        </SelectField>
      </HStack>

      <TextField
        name="link"
        label="Link"
        placeholder="Link to somewhere"
        inputLeftElement={<Icon color="gray.400" as={FaLink} />}
      />
      <TextField
        name="imageUrl"
        label="Image"
        placeholder="Enter an image url"
        inputLeftElement={<Icon color="gray.400" as={FaImage} />}
      />
      <TextAreaField
        name="notes"
        label="Notes"
        placeholder="Extra notes about this gear"
        inputLeftElement={<Icon color="yellow.400" as={FaStickyNote} />}
      />
    </Stack>
  );
};

export default GearFormFields;
