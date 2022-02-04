import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { useToast } from "@chakra-ui/toast";

import BoxLayout from "app/modules/common/layouts/box-layout";

import ResetPasswordForm from "../components/reset-password-form";

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSuccess = () => {
    router.push(Routes.HomePage());
    toast({
      title: "Password changed",
      description: "You have successfully changed your password.",
      status: "success",
    });
  };

  return <ResetPasswordForm onSuccess={handleSuccess} />;
};

ResetPasswordPage.getLayout = (page) => (
  <BoxLayout
    title="Reset Your Password"
    description="What would you like your new password to be?"
  >
    {page}
  </BoxLayout>
);

export default ResetPasswordPage;
