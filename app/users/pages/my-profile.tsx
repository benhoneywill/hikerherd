import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";

const MyProfilePage: BlitzPage = () => {
  return <p>My profile</p>;
};

MyProfilePage.authenticate = { redirectTo: Routes.LoginPage() };

MyProfilePage.getLayout = (page) => (
  <SingleColumnLayout title="My profile">{page}</SingleColumnLayout>
);

export default MyProfilePage;
