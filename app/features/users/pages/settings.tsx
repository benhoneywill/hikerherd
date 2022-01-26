import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { Heading } from "@chakra-ui/layout";

import SidebarLayout from "app/modules/common/layouts/sidebar-layout";
import Card from "app/modules/common/components/card";

import UserPreferencesForm from "../components/user-preferences-form";

const SettingsPage: BlitzPage = () => {
  return (
    <Fragment>
      <Heading size="md" mb={6}>
        Settings
      </Heading>

      <Card>
        <UserPreferencesForm />
      </Card>
    </Fragment>
  );
};

SettingsPage.authenticate = { redirectTo: Routes.LoginPage() };

SettingsPage.getLayout = (page) => (
  <SidebarLayout title="My settings">{page}</SidebarLayout>
);

export default SettingsPage;
