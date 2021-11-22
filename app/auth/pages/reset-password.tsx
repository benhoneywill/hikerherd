import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import Layout from "app/core/layouts/layout";

import ResetPasswordForm from "../components/reset-password-form";

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Set a New Password</h1>

      <ResetPasswordForm onSuccess={() => router.push(Routes.HomePage())} />
    </div>
  );
};

ResetPasswordPage.redirectAuthenticatedTo = Routes.HomePage();
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>;

export default ResetPasswordPage;
