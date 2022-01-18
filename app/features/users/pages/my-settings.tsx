import type { BlitzPage } from "blitz";
import type { UpdatePreferencesValues } from "../schemas/update-preferences-schema";

import { useMutation, Routes } from "blitz";

import {
  Button,
  Container,
  Box,
  HStack,
  Stack,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { FcSettings } from "react-icons/fc";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import Form, { FORM_ERROR } from "app/common/components/form";
import SelectField from "app/common/components/select-field";
import useModeColors from "app/common/hooks/use-mode-colors";
import PageHeader from "app/common/components/page-header";

import { Currency, WeightUnit } from "db";

import useCurrentUser from "../hooks/use-current-user";
import updatePreferencesSchema from "../schemas/update-preferences-schema";
import updatePreferencesMutation from "../mutations/update-preferences-mutation";

const MySettingsPage: BlitzPage = () => {
  const user = useCurrentUser();
  const toast = useToast();
  const { gray } = useModeColors();
  const [updatePreferences] = useMutation(updatePreferencesMutation);

  const handleSubmit = async (values: UpdatePreferencesValues) => {
    try {
      await updatePreferences(values);
      toast({
        title: "Your preferences have been saved.",
        description: "We've updated your user settings.",
        status: "success",
      });
    } catch (error) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <Container>
      <Box border="1px solid" borderColor={gray[200]} borderRadius="md" p={6}>
        <PageHeader title="My Settings" icon={FcSettings}></PageHeader>
        <Form
          schema={updatePreferencesSchema}
          initialValues={{ weightUnit: user?.weightUnit }}
          onSubmit={handleSubmit}
          render={(form) => (
            <Stack spacing={6}>
              <Stack spacing={4}>
                <SelectField name="weightUnit" label="Weight units">
                  <option value={WeightUnit.METRIC}>Metric (g / kg)</option>
                  <option value={WeightUnit.IMPERIAL}>
                    Imperial (oz / lb)
                  </option>
                </SelectField>

                <SelectField name="currency" label="Currency">
                  <option value={Currency.USD}>Dollars ($)</option>
                  <option value={Currency.GBP}>Pounds (£)</option>
                  <option value={Currency.EUR}>Euros (€)</option>
                </SelectField>
              </Stack>

              <HStack justify="flex-end">
                <Button
                  colorScheme="green"
                  isLoading={form.submitting}
                  type="submit"
                >
                  Save preferences
                </Button>
              </HStack>
            </Stack>
          )}
        />
      </Box>
    </Container>
  );
};

MySettingsPage.authenticate = { redirectTo: Routes.LoginPage() };

MySettingsPage.getLayout = (page) => (
  <SidebarLayout title="My settings">{page}</SidebarLayout>
);

export default MySettingsPage;
