import type { FC } from "react";
import type { CreateGearResult } from "../mutations/create-gear-mutation";
import type { UpdateGearResult } from "../mutations/update-gear-mutation";
import type { UpdateGearValues } from "../schemas/update-gear-schema";

import { useMutation, useQuery } from "blitz";

import { Stack } from "@chakra-ui/layout";
import {
  FaImage,
  FaLink,
  FaStickyNote,
  FaTag,
  FaHamburger,
  FaWeightHanging,
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
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import CheckboxField from "app/common/components/checkbox-field";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import { gToOz, ozTog } from "app/common/helpers/display-weight";
import TextDivider from "app/common/components/text-divider";
import SelectField from "app/common/components/select-field";

import { GearType } from "db";

import createGearMutation from "../mutations/create-gear-mutation";
import updateGearMutation from "../mutations/update-gear-mutation";
import updateGearSchema from "../schemas/update-gear-schema";
import categoryItemQuery from "../queries/category-item-query";

type GearFormProps = {
  gearId?: string | null;
  categoryId?: string | null;
  onSuccess?: (gear: CreateGearResult | UpdateGearResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const GearForm: FC<GearFormProps> = ({
  gearId,
  categoryId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createGear] = useMutation(createGearMutation);
  const [updateGear] = useMutation(updateGearMutation);
  const { weightUnit, currency } = useUserPreferences();

  const [gearItem, { isLoading }] = useQuery(
    categoryItemQuery,
    { id: gearId },
    { suspense: false, enabled: !!gearId }
  );

  const initialValues = {
    id: gearItem ? gearItem.gear.id : "",
    name: gearItem ? gearItem.gear.name : "",
    weight: gearItem
      ? weightUnit === "IMPERIAL"
        ? gToOz(gearItem.gear.weight)
        : gearItem.gear.weight
      : 0,
    price: gearItem ? gearItem.gear.price : null,
    type: gearItem ? gearItem.gear.type : null,
    currency: gearItem ? gearItem.gear.currency : currency,
    link: gearItem ? gearItem.gear.link : null,
    imageUrl: gearItem ? gearItem.gear.imageUrl : null,
    notes: gearItem ? gearItem.gear.notes : null,
    consumable: gearItem ? gearItem.gear.consumable : false,
  };

  const handleSubmit = async (values: Omit<UpdateGearValues, "id">) => {
    try {
      let result;

      if (weightUnit === "IMPERIAL") {
        values.weight = ozTog(values.weight);
      }

      if (gearItem) {
        result = await updateGear({ id: gearItem.gear.id, ...values });
      } else {
        if (!categoryId) throw new Error();
        result = await createGear({ categoryId, ...values });
      }

      onClose();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: unknown) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      title={gearId ? `Editing ${gearItem?.gear.name}` : "Add some new gear"}
      schema={updateGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      size="lg"
      render={() => (
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

          <TextDivider>Addons</TextDivider>

          <SelectField
            name="type"
            label="Pick a gear type"
            placeholder="uncategorized"
          >
            {Object.keys(GearType).map((type) => (
              <option key={type} value={type}>
                {type.toLowerCase()}
              </option>
            ))}
          </SelectField>

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
      )}
    />
  );
};

export default GearForm;
