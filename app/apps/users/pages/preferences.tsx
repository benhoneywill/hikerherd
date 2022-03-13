import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { Heading } from "@chakra-ui/layout";

import SidebarLayout from "app/layouts/sidebar-layout";
import Card from "app/components/card";

import UserPreferencesForm from "../components/user-preferences-form";

const PreferencesPage: BlitzPage = () => {
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

PreferencesPage.authenticate = { redirectTo: Routes.LoginPage() };

PreferencesPage.getLayout = (page) => (
  <SidebarLayout title="My settings">{page}</SidebarLayout>
);

export default PreferencesPage;
