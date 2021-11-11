import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { Layout } from "app/core/layouts/layout";

const MyProfilePage: BlitzPage = () => {
  return null;
};

MyProfilePage.authenticate = { redirectTo: Routes.LoginPage() };

MyProfilePage.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default MyProfilePage;
