import type { BlitzPage } from "blitz";

import { Link, Routes } from "blitz";

import { Button } from "@chakra-ui/button";

import BoxLayout from "app/layouts/box-layout";

const ForgotPasswordConfirmPage: BlitzPage = () => {
  return (
    <Link href={Routes.LoginPage()} passHref>
      <Button as="a" isFullWidth size="lg">
        Back to login
      </Button>
    </Link>
  );
};

ForgotPasswordConfirmPage.redirectAuthenticatedTo = Routes.HomePage();
ForgotPasswordConfirmPage.getLayout = (page) => (
  <BoxLayout
    title="Your email is on the way"
    description="If your email address has a hikerherd account then you have been sent a password reset link."
  >
    {page}
  </BoxLayout>
);

export default ForgotPasswordConfirmPage;
