import type { BlitzPage } from "blitz";

import { Link, useRouter, Routes } from "blitz";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";

import BoxLayout from "app/common/layouts/box-layout";
import TextDivider from "app/common/components/text-divider";

import SignupForm from "../components/signup-form";

const SignupPage: BlitzPage = () => {
  const router = useRouter();
  const toast = useToast();

  const handleSuccess = () => {
    router.push(Routes.HomePage());
    toast({
      title: "Welcome to hikerherd.",
      description: "We've created your account for you.",
      status: "success",
    });
  };

  return (
    <Stack spacing={8}>
      <SignupForm onSuccess={handleSuccess} />
      <TextDivider>Or</TextDivider>
      <Link href={Routes.LoginPage()} passHref>
        <Button size="lg" as="a">
          Log in
        </Button>
      </Link>
    </Stack>
  );
};

SignupPage.redirectAuthenticatedTo = Routes.HomePage();
SignupPage.getLayout = (page) => (
  <BoxLayout
    title="Sign up"
    description="A journey of 1,000 miles begins with a single click."
  >
    {page}
  </BoxLayout>
);

export default SignupPage;
