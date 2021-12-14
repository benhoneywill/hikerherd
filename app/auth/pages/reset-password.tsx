import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import BoxLayout from "app/core/layouts/box-layout";

import ResetPasswordForm from "../components/reset-password-form";

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter();

  return <ResetPasswordForm onSuccess={() => router.push(Routes.HomePage())} />;
};

ResetPasswordPage.redirectAuthenticatedTo = Routes.HomePage();
ResetPasswordPage.getLayout = (page) => (
  <BoxLayout
    title="Reset Your Password"
    description="Enter your new details in the form below to change your password"
  >
    {page}
  </BoxLayout>
);

export default ResetPasswordPage;
