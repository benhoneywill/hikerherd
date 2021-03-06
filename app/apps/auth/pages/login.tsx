import type { BlitzPage } from "blitz";

import { useRouter, Link, Routes } from "blitz";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";

import BoxLayout from "app/layouts/box-layout";
import TextDivider from "app/components/text-divider";

import LoginForm from "../components/login-form";

const LoginPage: BlitzPage = () => {
  const router = useRouter();
  const toast = useToast();

  const next = router.query.next as string | undefined;
  const redirectTo = decodeURIComponent(next || "/");

  return (
    <Stack spacing={8}>
      <LoginForm
        onSuccess={(user) => {
          router.push(redirectTo);
          toast({
            title: `Welcome back ${user.username}!`,
            description: "You have logged in successfully.",
            status: "success",
          });
        }}
      />

      <TextDivider>Or</TextDivider>

      <Stack spacing={4}>
        <Link href={Routes.SignupPage()} passHref>
          <Button as="a" isFullWidth size="lg">
            Sign up
          </Button>
        </Link>
        <Link href={Routes.ForgotPasswordPage()} passHref>
          <Button as="a" isFullWidth size="lg">
            Reset password
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

LoginPage.redirectAuthenticatedTo = Routes.StartPage();
LoginPage.getLayout = (page) => (
  <BoxLayout title="Log in" description="Sign the trail register.">
    {page}
  </BoxLayout>
);

export default LoginPage;
