import type { BlitzPage } from "blitz";

import { useRouter, Link, Routes } from "blitz";

import { Divider, HStack } from "@chakra-ui/layout";

import BoxLayout from "app/core/layouts/box-layout";
import LoginForm from "app/auth/components/login-form";

const LoginPage: BlitzPage = () => {
  const router = useRouter();
  const redirectTo = decodeURIComponent((router.query.next as string) || "/");

  return (
    <div>
      <LoginForm onSuccess={() => router.push(redirectTo)} />

      <Divider my={6} />

      <HStack>
        <Link href={Routes.ForgotPasswordPage()}>
          <a>Forgot your password?</a>
        </Link>
        <Link href={Routes.SignupPage()}>Sign Up</Link>
      </HStack>
    </div>
  );
};

LoginPage.redirectAuthenticatedTo = Routes.HomePage();
LoginPage.getLayout = (page) => (
  <BoxLayout title="Login" description="Enter your details below to log in.">
    {page}
  </BoxLayout>
);

export default LoginPage;
