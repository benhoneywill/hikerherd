import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import BoxLayout from "app/core/layouts/box-layout";
import SignupForm from "app/auth/components/signup-form";

const SignupPage: BlitzPage = () => {
  const router = useRouter();

  return <SignupForm onSuccess={() => router.push(Routes.HomePage())} />;
};

SignupPage.redirectAuthenticatedTo = Routes.HomePage();
SignupPage.getLayout = (page) => (
  <BoxLayout
    title="Sign Up"
    description="To get started with hikerherd, choose a username and password."
  >
    {page}
  </BoxLayout>
);

export default SignupPage;
