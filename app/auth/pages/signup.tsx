import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { Layout } from "app/core/layouts/layout";
import { SignupForm } from "app/auth/components/signup-form";

const SignupPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <div>
      <SignupForm onSuccess={() => router.push(Routes.HomePage())} />
    </div>
  );
};

SignupPage.redirectAuthenticatedTo = "/";
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>;

export default SignupPage;
