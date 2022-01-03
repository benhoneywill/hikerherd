import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { useToast } from "@chakra-ui/react";

import BoxLayout from "app/common/layouts/box-layout";

import ResetPasswordForm from "../components/reset-password-form";

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSuccess = () => {
    router.push(Routes.HomePage());
    toast({
      title: "Your password has been changed.",
      description: "We've updated your password for you.",
      status: "success",
    });
  };

  return <ResetPasswordForm onSuccess={handleSuccess} />;
};

ResetPasswordPage.getLayout = (page) => (
  <BoxLayout
    title="Reset Your Password"
    description="Enter your new details in the form below to change your password"
  >
    {page}
  </BoxLayout>
);

export default ResetPasswordPage;
