import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import SidebarLayout from "app/common/layouts/sidebar-layout";

const MyProfilePage: BlitzPage = () => {
  return <p>My profile</p>;
};

MyProfilePage.authenticate = { redirectTo: Routes.LoginPage() };

MyProfilePage.getLayout = (page) => (
  <SidebarLayout title="My profile">{page}</SidebarLayout>
);

export default MyProfilePage;
