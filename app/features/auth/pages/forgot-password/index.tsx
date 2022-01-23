import type { BlitzPage } from "blitz";

import { useRouter, Link, Routes } from "blitz";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import BoxLayout from "app/modules/common/layouts/box-layout";
import TextDivider from "app/modules/common/components/text-divider";

import ForgotPasswordForm from "../../components/forgot-password-form";

const ForgotPasswordPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <Stack spacing={8}>
      <ForgotPasswordForm
        onSuccess={() => router.push(Routes.ForgotPasswordConfirmPage())}
      />

      <TextDivider>Or</TextDivider>

      <Stack spacing={4}>
        <Link href={Routes.LoginPage()} passHref>
          <Button as="a" isFullWidth size="lg">
            Log in
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

ForgotPasswordPage.redirectAuthenticatedTo = Routes.HomePage();
ForgotPasswordPage.getLayout = (page) => (
  <BoxLayout
    title="Forgot Your Password?"
    description="No worries. Tell us your email and you will be sent instructions for resetting your password."
  >
    {page}
  </BoxLayout>
);

export default ForgotPasswordPage;
