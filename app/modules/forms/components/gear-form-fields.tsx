import type { FC } from "react";

import { useContext } from "react";

import { Grid, Stack } from "@chakra-ui/layout";
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

import userPreferencesContext from "app/features/users/contexts/user-preferences-context";
import TextDivider from "app/modules/common/components/text-divider";

import TextField from "./text-field";
import TextAreaField from "./text-area-field";
import CheckboxField from "./checkbox-field";
import SelectField from "./select-field";

type GearFormFieldsProps = {
  includeWorn?: boolean;
};

const GearFormFields: FC<GearFormFieldsProps> = ({ includeWorn }) => {
  const { weightUnit } = useContext(userPreferencesContext);

  return (
    <Stack spacing={4}>
      <TextField name="name" label="Name" placeholder="Name" />

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

      <Grid templateColumns="70px 1fr" gap={2} alignItems="flex-end">
        <SelectField label="Price" name="currency">
          <option value="USD">$</option>
          <option value="GBP">£</option>
          <option value="EUR">€</option>
        </SelectField>
        <TextField
          type="number"
          name="price"
          placeholder="0.00"
          inputLeftElement={<Icon color="purple.400" as={FaTag} />}
        />
      </Grid>

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
