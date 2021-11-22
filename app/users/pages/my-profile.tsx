import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import Layout from "app/core/layouts/layout";

const MyProfilePage: BlitzPage = () => {
  return <p>My profile</p>;
};

MyProfilePage.authenticate = { redirectTo: Routes.LoginPage() };

MyProfilePage.getLayout = (page) => <Layout title="My profile">{page}</Layout>;

export default MyProfilePage;
