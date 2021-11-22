import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { useState } from "react";

import Layout from "app/core/layouts/layout";

import ForgotPasswordForm from "../components/forgot-password-form";

const ForgotPasswordPage: BlitzPage = () => {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div>
        <h2>Request Submitted</h2>
        <p>
          If your email is in our system, you will receive instructions to reset your password
          shortly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Forgot your password?</h1>
      <ForgotPasswordForm onSuccess={() => setSuccess(true)} />
    </div>
  );
};

ForgotPasswordPage.redirectAuthenticatedTo = Routes.HomePage();
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>;

export default ForgotPasswordPage;
